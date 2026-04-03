from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Address

class AddressInline(admin.TabularInline):
    model = Address
    extra = 1

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    # Añadimos nuestras inlines de direcciones
    inlines = [AddressInline]
    
    # Añadimos el teléfono a la vista de lista del admin de Django
    list_display = BaseUserAdmin.list_display + ('phone',)
    
    # Añadimos nuestros campos personalizados a los formularios de edición
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Información Adicional', {'fields': ('phone',)}),
    )