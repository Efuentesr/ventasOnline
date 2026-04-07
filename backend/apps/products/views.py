from rest_framework import viewsets, filters, permissions
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product, Category
from .serializers import ProductListSerializer, CategorySerializer, ProductDetailSerializer

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Catálogo de productos con búsqueda, filtros y ordenamiento.
    Pública: No requiere estar logueado.
    Busca por 'slug' en la URL.
    """
    queryset = Product.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = ProductListSerializer
    # permission_classes = [permissions.AllowAny]
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    # Motores de búsqueda y filtrado
    filter_backends = [
        DjangoFilterBackend, 
        filters.SearchFilter, 
        filters.OrderingFilter
    ]
    
    # Filtros por URL
    filterset_fields = {
        'category__slug': ['exact'],
        'price': ['gte', 'lte'], # Mayor o igual / Menor o igual
        'stock': ['gt'],         # Solo mostrar si stock es mayor a 0
    }
    
    # Barra de búsqueda global
    #search_fields = ['name', 'code', 'description', 'category__name']
    search_fields = ['name', 'code', 'description']
    
    # Opciones de ordenamiento
    ordering_fields = ['price', 'created_at']

    def get_serializer_class(self):
        """
        Determina qué serializador usar:
        - Detalle (retrieve): ProductDetailSerializer (con imágenes)
        - Lista (list): ProductListSerializer (ligero)
        """
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductListSerializer
    
