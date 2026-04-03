from django.apps import AppConfig

class ProductsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.products'  # El camino completo para que Python lo encuentre
    label = 'products'      # El nombre corto que Django usará internamente