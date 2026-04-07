from rest_framework import serializers
from django.db import transaction
from .models import Order, OrderItem
from apps.sales.models import Cart, CartItem
#from apps.products.models import Product
from apps.products.serializers import ProductListSerializer

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
    final_price = serializers.ReadOnlyField() # Viene de la @property del modelo

    class Meta:
        model = Order
        # Corregido: 'user' cambiado a 'customer' y 'customer_name' añadido
        fields = [
            'id', 'customer', 'customer_name', 'status', 'items',
            'discount', 'total_price', 'final_price', 
            'created_at', 'updated_at'
        ]
        # El cliente no debería poder manipular estos campos al crear
        read_only_fields = ['customer', 'status', 'total_price', 'discount']


    @transaction.atomic
    def create(self, validated_data):
        try:
            items_data = validated_data.pop('items')
            request_user = self.context['request'].user
            
            # 1. Crear la cabecera
            order = Order.objects.create(
                customer=request_user,
                total_price=0,
                status='creada'
            )
            
            total = 0
            for item in items_data:
                product = item['product']
                qty = item['quantity']

                # Validar Stock
                if product.stock < qty:
                    raise Exception(f"Stock insuficiente para {product.name}")

                # 3. Crear el detalle y descontar stock
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=qty,
                    price=product.price
                )
                
                product.stock -= qty
                product.save()
                
                total += (product.price * qty)

            # 4. Actualizar total final
            order.total_price = total
            order.save()
            return order

        except Exception as e:
            # Esto convertirá el error 500 en un error 400 con el mensaje real
            raise serializers.ValidationError({"debug_error": str(e)})