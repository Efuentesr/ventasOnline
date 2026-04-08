from rest_framework import serializers
from django.db import transaction
from .models import Order, OrderItem
from apps.sales.models import Cart, CartItem
#from apps.products.models import Product
from apps.products.serializers import ProductListSerializer
from decimal import Decimal

class CartItemSerializer(serializers.ModelSerializer):
    product_details = ProductListSerializer(source='product', read_only=True)
    subtotal = serializers.ReadOnlyField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_details', 'quantity']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_cart = serializers.ReadOnlyField()

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'total_cart', 'updated_at']

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'price', 'quantity']
        # Importante: El precio se congela en el create del OrderSerializer
        read_only_fields = ['price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    customer_name = serializers.ReadOnlyField(source='customer.username')
    final_price = serializers.ReadOnlyField()

    class Meta:
        model = Order
        fields = [
            'id', 'customer', 'customer_name', 'status', 'items',
            'discount', 'total_price', 'final_price', 
            'created_at', 'updated_at'
        ]
        # AGREGAMOS 'customer' aquí abajo:
        read_only_fields = ['customer', 'customer_name', 'status', 'total_price', 'final_price', 'created_at']

    @transaction.atomic
    def create(self, validated_data):
        try:
            # validated_data ya no intentará buscar 'customer' porque es read_only
            items_data = validated_data.pop('items')
            request_user = self.context['request'].user
            
            # 1. Crear la cabecera usando el usuario del request
            order = Order.objects.create(
                customer=request_user,
                total_price=0,
                discount=validated_data.get('discount', 0), # Capturamos el descuento si viene
                status='creada'
            )
            
            total = Decimal('0.00') # Usamos Decimal para evitar errores de precisión
            for item in items_data:
                product = item['product']
                qty = item['quantity']

                if product.stock < qty:
                    raise serializers.ValidationError(f"Stock insuficiente para {product.name}")

                OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=qty,
                    price=product.price
                )
                
                product.stock -= qty
                product.save()
                
                total += (product.price * qty)

            order.total_price = total
            order.save()
            return order

        except Exception as e:
            raise serializers.ValidationError({"error": str(e)})