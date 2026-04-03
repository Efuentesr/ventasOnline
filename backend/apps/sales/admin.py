from django.contrib import admin
from simple_history.admin import SimpleHistoryAdmin
from .models import Order, OrderItem, Payment, Cart, CartItem

class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['user', 'total_cart', 'updated_at']
    inlines = [CartItemInline]

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0 # No permitimos agregar items vacíos a una orden ya hecha
    readonly_fields = ['price'] # El admin no debería alterar el precio histórico

@admin.register(Order)
class OrderAdmin(SimpleHistoryAdmin):
    list_display = ['id', 'user', 'status', 'total_price', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['user__username', 'id']
    inlines = [OrderItemInline]
    
    # Protegemos datos sensibles para que el admin no los edite por error
    readonly_fields = ['total_price', 'created_at', 'updated_at']

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['order', 'method', 'amount', 'status', 'created_at']
    list_filter = ['status', 'method']
    readonly_fields = ['created_at']