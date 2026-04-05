from rest_framework import serializers
from .models import Product, ProductImage, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

# apps/products/serializers.py
class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_feature', 'alt_text'] # Incluimos is_feature

class ProductListSerializer(serializers.ModelSerializer):
    """Versión ligera para listados (Search/Grid)"""
    category = serializers.StringRelatedField()
    main_image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'category', 'main_image', 'stock']

    def get_main_image(self, obj):
        # Buscamos la imagen que tenga is_feature=True
        image = obj.images.filter(is_feature=True).first()
        # Si no hay ninguna marcada, usamos la primera que encuentre
        if not image:
            image = obj.images.first()
        
        if image:
            # Construimos la URL completa para que React no sufra
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(image.image.url)
            return image.image.url
        return None
    
class ProductDetailSerializer(serializers.ModelSerializer):
    # 'images' debe coincidir con el related_name en tu Model
    images = ProductImageSerializer(many=True, read_only=True) 

    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'description', 'images', 'stock']