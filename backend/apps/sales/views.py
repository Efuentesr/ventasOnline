from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Order, Cart
from .serializers import OrderSerializer, CartSerializer

class CartViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CartSerializer

    def get_queryset(self):
        # El usuario solo ve SU carrito
        return Cart.objects.filter(user=self.request.user)

    # Aquí podrías añadir lógica para agregar items al carrito mediante un @action

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    # Solo usuarios autenticados pueden entrar aquí
    permission_classes = [permissions.IsAuthenticated]
    
    # Filtros para que el frontend (React/Flutter) busque por estado o fecha
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status']
    ordering_fields = ['created_at', 'status']

    def get_queryset(self):
        user = self.request.user

        # Si es admin, ve absolutamente todas las órdenes
        if user.is_staff:
            return Order.objects.all()
        
        # El cliente solo ve sus órdenes ordenadas por fecha reciente
        return Order.objects.filter(user=user).order_by('-created_at')

    def get_serializer_context(self):
        # Pasamos el request al serializer para saber qué usuario está comprando
        return {'request': self.request}
    
    def perform_create(self, serializer):
        # Al crear una orden, asignamos automáticamente al usuario logueado
        serializer.save(user=self.request.user)

