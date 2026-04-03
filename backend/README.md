
# 💎 Ventas Online API (Fullstack Backend)
Este es el núcleo de procesamiento (Core API) para la plataforma de E-commerce. Construido con un enfoque escalable, utiliza Django Rest Framework para la lógica de negocio y Docker para asegurar un entorno de desarrollo idéntico en cualquier máquina.
## 🚀 Tecnologías Principales
- Framework: Django 5.0 + Django REST Framework (DRF)
- Base de Datos: PostgreSQL 15 (Dockerizado)
- Autenticación: JWT (JSON Web Tokens) con djangorestframework-simplejwt
- Contenerización: Docker & Docker Compose
- Documentación: Swagger / OpenAPI 3.0
## 🛠️ Requisitos Previos
- Docker Desktop instalado.
- DBeaver o cualquier cliente SQL (opcional, para visualización).
## 📦 Instalación y Despegue

Sigue estos pasos para levantar el entorno de desarrollo:
1. Levantar Contenedores:
Bash
docker-compose up -d --build
2. Ejecutar Migraciones (Preparar Base de Datos):
Bash
docker-compose exec web python manage.py migrate
3. Cargar Datos de Prueba (70 productos con Slugs y Códigos):
Bash
docker-compose exec web python manage.py seed_data
4. Crear Acceso de Administrador:
Bash
docker-compose exec web python manage.py createsuperuser

## 📂 Estructura del Proyecto
El backend está organizado de forma modular para facilitar el mantenimiento:
- **apps/accounts:** Gestión de usuarios personalizados y perfiles.
- **apps/products:** Catálogo, categorías, stocks y lógicas de códigos únicos.
- **apps/sales:** Carrito de compras y gestión de órdenes/pedidos.
- **core/:** Configuración central del proyecto y rutas principales.
- **logs/:** Registro de errores del sistema.
## 🔗 Endpoints Principales (API)

    | Método | Endpoint                | Descripción                             |
    | ------ | ----------------------- | --------------------------------------- |
    | GET    | /api/products/items/    | Lista completa de joyas y artículos.    |
    | POST   | /api/accounts/register/ | Registro de nuevos clientes.            |
    | POST   | /api/token/             | Obtención de tokens JWT (Login).        |
    | GET    | /api/sales/cart/        | Gestión del carrito del usuario activo. |
    | GET    | /api/docs/              | Documentación Swagger completa.         |

## 🛠️ Comandos de Mantenimiento Útiles
- **Ver Logs en tiempo real:** docker-compose logs -f web
- **Entrar a la terminal del contenedor:** docker-compose exec web sh
- **Reiniciar Base de Datos (Limpieza total):** docker-compose down -v
## 🛡️ Seguridad y Auditoría
- **Simple History:** Todas las modificaciones en productos y precios quedan registradas con nombre de usuario y fecha.
- **CORS:** Configurado para permitir la comunicación exclusiva con el futuro Frontend en React.Nota: Este proyecto fue desarrollado siguiendo estándares de industria para aplicaciones móviles y web en 2026.