from django.apps import AppConfig

class SalesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.sales'  # El camino completo para que Python lo encuentre
    label = 'sales'      # El nombre corto que Django usará internamente