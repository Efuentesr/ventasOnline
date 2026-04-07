# 1. Paginación (Django + React)
No queremos que el Home.jsx haga una petición que traiga 70 objetos con todas sus imágenes. Vamos a dividirlo en "páginas" (por ejemplo, de 12 en 12).

En el Backend (Django)
Django Rest Framework (DRF) lo hace muy fácil. Solo necesitas añadir esto a tu settings.py:


## settings.py
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 12  # Número de productos por página
}
Ahora, cuando consultes /api/products/, Django no devolverá una lista [], sino un objeto con count, next, previous y results.

En el Frontend (React)
Tendrás que ajustar el Home.jsx para que lea res.data.results en lugar de res.data. También necesitaremos botones de "Anterior" y "Siguiente".





# 2. Autenticación (JWT - JSON Web Tokens)
Para una E-commerce, lo estándar hoy en día es usar JWT. Es como un "pase VIP" que el servidor le da al usuario cuando hace login, y que el navegador guarda para decir "soy yo" en cada petición.

Los 3 pilares de la autenticación que montaremos:
Registro/Login: Un formulario donde el usuario pide su token.

Almacenamiento: Guardar ese token en el navegador (similar a como hicimos con el carrito).

Interceptores: Configurar axios para que, si hay un token, lo pegue automáticamente en la cabecera de cada petición: Authorization: Bearer <token>.


