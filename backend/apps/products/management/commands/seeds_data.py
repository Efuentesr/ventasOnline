import random
from django.core.management.base import BaseCommand
from apps.products.models import Product, Category
from django.utils.text import slugify

class Command(BaseCommand):
    help = 'Carga 70 productos de prueba (Joyas y Scrapbook) con códigos únicos'

    def handle(self, *args, **kwargs):
        # 1. Limpiar datos viejos para evitar duplicados de 'code'
        self.stdout.write("Limpiando base de datos...")
        Product.objects.all().delete()
        Category.objects.all().delete()

        # 2. Crear Categorías
        cat_joyas = Category.objects.create(name="Joyería Artesanal", slug="joyeria-artesanal")
        cat_scrap = Category.objects.create(name="Scrapbooking", slug="scrapbooking")

        # 3. Listas de nombres para variedad
        nombres_joyas = ["Collar", "Anillo", "Pulsera", "Pendientes", "Dije"]
        materiales = ["Plata .925", "Oro Rosa", "Cuarzo Amatista", "Piedra Luna", "Acero Inoxidable"]
        
        nombres_scrap = ["Álbum", "Set de Papeles", "Troqueladora", "Pegatinas", "Kit de Iniciación"]
        tematicas = ["Vintage", "Boda", "Viajes", "Bebé", "Botánico"]

        # 4. Generar 35 Joyas
        for i in range(1, 36):
            nombre = f"{random.choice(nombres_joyas)} {random.choice(materiales)} #{i}"
            # Generamos un código como: JOY-001, JOY-002...
            codigo = f"JOY-{str(i).zfill(3)}" 
            
            Product.objects.create(
                name=nombre,
                code=codigo, # <-- NUEVO CAMPO
                description=f"Una pieza única de nuestra colección de joyería. Código de seguimiento: {codigo}",
                price=random.uniform(15.0, 150.0),
                stock=random.randint(1, 20),
                category=cat_joyas,
                is_active=True
            )

        # 5. Generar 35 productos de Scrapbook
        for i in range(1, 36):
            nombre = f"{random.choice(nombres_scrap)} {random.choice(tematicas)} #{i}"
            # Generamos un código como: SCR-001, SCR-002...
            codigo = f"SCR-{str(i).zfill(3)}"
            
            Product.objects.create(
                name=nombre,
                code=codigo, # <-- NUEVO CAMPO
                description=f"Material de alta calidad para tus proyectos creativos. SKU: {codigo}",
                price=random.uniform(5.0, 60.0),
                stock=random.randint(5, 50),
                category=cat_scrap,
                is_active=True
            )

        self.stdout.write(self.style.SUCCESS(f'Éxito: Se han cargado 70 productos con códigos únicos.'))