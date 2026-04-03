from rest_framework import serializers
from .models import Product, ProductImage, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_feature']

class ProductListSerializer(serializers.ModelSerializer):
    """Versión ligera para listados (Search/Grid)"""
    category = serializers.StringRelatedField()
    main_image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'category', 'main_image', 'stock']

    def get_main_image(self, obj):
        image = obj.images.filter(is_feature=True).first()
        if image:
            return image.image.url
        return None