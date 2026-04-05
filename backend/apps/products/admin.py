from django.contrib import admin
from simple_history.admin import SimpleHistoryAdmin
from .models import Category, Supplier, Product, ProductImage

# Esto permite subir fotos directamente dentro de la pantalla del Producto
class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 4 # Te muestra una casilla vacía lista para subir una foto

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)} # Slug automático aquí también

@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ['name', 'contact_email', 'phone']
    search_fields = ['name', 'contact_email']

@admin.register(Product)
class ProductAdmin(SimpleHistoryAdmin): # Usamos SimpleHistoryAdmin para los logs
    list_display = ['name', 'category', 'price', 'stock', 'is_active']
    list_filter = ['category', 'is_active']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)} # El truco del slug automático
    inlines = [ProductImageInline] # Metemos las fotos aquí