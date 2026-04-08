#app/sales/views.py

from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Order, Cart
from .serializers import OrderSerializer, CartSerializer
from decimal import Decimal
from .models import CartItem
from apps.products.models import Product
from django.shortcuts import get_object_or_404
from django.db import transaction

class CartViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CartSerializer

    def get_queryset(self):
        # El usuario solo ve SU carrito
        return Cart.objects.filter(user=self.request.user)


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status']
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(customer=user).order_by('-created_at')

    # Quitamos el perform_create custom por ahora para dejar que el 
    # Serializer tome el usuario del contexto 'request'

    def partial_update(self, request, *args, **kwargs):
        order = self.get_object()
        # Solo el staff (admin) puede cambiar el estado a 'aprobada'
        if 'status' in request.data and not request.user.is_staff:
            return Response(
                {"error": "No tienes permiso para aprobar órdenes."}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().partial_update(request, *args, **kwargs)
    
    def perform_create(self, serializer):
        # ESTO es lo que evita el error 400. 
        # Django toma el usuario del token y lo inyecta antes de guardar.
        serializer.save(customer=self.request.user)
    


class SyncCartView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic # Importante para que si algo falla, no borre el carrito anterior
    def post(self, request):
        try:
            items_data = request.data.get('items', [])
            cart, _ = Cart.objects.get_or_create(user=request.user)

            # 1. Borramos todos los items viejos de este carrito
            # Esto elimina el error de "returned more than one" para siempre
            cart.items.all().delete()

            # 2. Creamos los nuevos items
            for item in items_data:
                p_id = item.get('product_id') or item.get('id') or item.get('product')
                if not p_id: continue
                
                product = get_object_or_404(Product, id=p_id)
                
                # Usamos create() porque ya limpiamos la tabla arriba
                CartItem.objects.create(
                    cart=cart,
                    product=product,
                    quantity=item.get('quantity', 1)
                )

            return Response({"message": "Sincronizado"}, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)