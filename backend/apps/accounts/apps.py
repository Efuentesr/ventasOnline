from django.apps import AppConfig

class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.accounts'  # El camino completo para que Python lo encuentre
    label = 'accounts'      # El nombre corto que Django usará internamente