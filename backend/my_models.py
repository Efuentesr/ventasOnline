from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

# --- 1. USUARIOS ---
class User(AbstractUser):
    # El username ya es único e indexado por defecto en Django
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    
    def __str__(self):
        return self.username
    
class Address(models.Model):
    user = models.ForeignKey(User, related_name='addresses', on_delete=models.CASCADE)
    address_line1 = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20)
    is_default = models.BooleanField(default=False)

# --- 2. PROVEEDORES Y CATEGORÍAS ---
class Supplier(models.Model):
    name = models.CharField(max_length=255)
    contact_email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)

    def __str__(self):
        return self.name

# --- 2. CATEGORÍAS ---
class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True) # Para URLs amigables joyas-y-bisuteria

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name

# --- 3. PRODUCTOS ---
class Product(models.Model):
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=255, db_index=True) # Indexado para búsquedas rápidas
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    separated_qty = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='products/') # Requiere Pillow instalado
    is_feature = models.BooleanField(default=False) # Foto principal

# --- 4. RESEÑAS (REVIEWS) ---
class Review(models.Model):
    product = models.ForeignKey(Product, related_name='reviews', on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


# --- 4. CARRITO ---
class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

# --- 5. ORDENES ---
class Order(models.Model):
    STATUS_CHOICES = (
        ('creada', 'Creada'),
        ('anulada', 'Anulada'),
        ('aprobada', 'Aprobada'),
        ('pagada', 'Pagada'),
    )
    # En Django, el parámetro related_name en un ForeignKey define cómo accedes a los objetos relacionados desde el modelo inverso
    #Desde un objeto User, quiero acceder a sus órdenes usando .orders”
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='creada', db_index=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=10, decimal_places=2)
    tax = models.DecimalField(max_digits=10, decimal_places=2)

    # Tracking de fechas
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        # Orden predeterminado: por estado y luego por fecha más reciente
        ordering = ['status', '-created_at']

    def __str__(self):
        return f"Orden {self.id} - {self.user.username}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.PROTECT) # No borrar producto si hay orden
    price = models.DecimalField(max_digits=10, decimal_places=2) # Precio histórico al momento de compra
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"

class Payment(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='payment')
    method = models.CharField(max_length=50) # Ej: 'Stripe', 'PayPal', 'MercadoPago'
    transaction_id = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50) # 'Completed', 'Pending', 'Failed'
    created_at = models.DateTimeField(auto_now_add=True)