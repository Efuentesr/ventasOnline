# 1. Imagen base de Python ligera (versión 2026)
FROM python:3.12-slim

# 2. Evita que Python genere archivos .pyc y permite ver logs en tiempo real
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# 3. Directorio de trabajo dentro del contenedor
WORKDIR /app

# 4. Instalar dependencias del sistema necesarias para PostgreSQL y Pillow (Imágenes)
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    libjpeg-dev \
    zlib1g-dev \
    --no-install-recommends && rm -rf /var/lib/apt/lists/*

# 5. Instalar dependencias de Python
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# 6. Copiar el resto del código
COPY . /app/

# 7. Puerto que usa Django
EXPOSE 8000

# 8. Comando para arrancar el servidor
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]