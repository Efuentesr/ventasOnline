from rest_framework import serializers
from django.contrib.auth import get_user_model
from apps.sales.models import Cart

User = get_user_model()

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name']

    def validate_email(self, value):
        # Validación extra para que no se repitan correos
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este correo ya está registrado.")
        return value

    def create(self, validated_data):
        # Usamos create_user para que encripte la contraseña en la DB
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        
        # PRO TIP: Creamos su carrito personal en el mismo instante
        Cart.objects.create(user=user)
        return user