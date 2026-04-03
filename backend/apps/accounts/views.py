from rest_framework import status, views, generics, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .serializers import UserRegisterSerializer

User = get_user_model()

class RegisterView(views.APIView):
    """
    Crea un nuevo usuario, su carrito automático y devuelve sus tokens JWT.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Generamos login automático tras el registro
            refresh = RefreshToken.for_user(user)
            
            return Response({
                "message": "Usuario creado con éxito",
                "tokens": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    Ver y editar el perfil del usuario logueado.
    Protegida: Requiere Token JWT.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        # Siempre devuelve el usuario que está haciendo la petición
        return self.request.user