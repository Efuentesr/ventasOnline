# sales/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, CartViewSet, SyncCartView

router = DefaultRouter()
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'cart', CartViewSet, basename='cart')


urlpatterns = [
    path('', include(router.urls)),
    path('sync-cart/', SyncCartView.as_view(), name='sync-cart'),
]