from rest_framework import serializers
from django.db import transaction
from .models import Order, OrderItem
from apps.sales.models import Cart, CartItem
#from apps.products.models import Product
from apps.products.serializers import ProductListSerializer

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    subtotal = serializers.ReadOnlyField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity', 'subtotal']

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
        read_only_fields = ['price'] # El cliente no envía el precio, lo toma el server

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Order
        fields = ['id', 'user', 'address', 'status', 'total_price', 'items', 'created_at']
        read_only_fields = ['total_price', 'status']

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        user = self.context['request'].user
        
        # 1. Crear la cabecera de la orden (precio inicial 0)
        order = Order.objects.create(user=user, total_price=0, **validated_data)
        
        total = 0
        for item in items_data:
            product = item['product']
            qty = item['quantity']

            # 2. Validar Stock
            if product.stock < qty:
                raise serializers.ValidationError(f"Stock insuficiente para {product.name}")

            # 3. Congelar precio y descontar stock
            price_at_purchase = product.price
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=qty,
                price=price_at_purchase
            )
            
            product.stock -= qty
            product.save()
            
            total += price_at_purchase * qty

        # 4. Actualizar total final de la orden
        order.total_price = total
        order.save()
        return order