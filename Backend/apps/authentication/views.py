from rest_framework import views, status, permissions
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from apps.users.serializers import UserSerializer


class LoginView(views.APIView):
    """
    Professional login view that returns a token and user details.
    Supports role-based validation.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        role = request.data.get('role')

        if not email or not password:
            return Response(
                {"detail": "Please provide both email and password."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Authenticate using email (which is the username in our case or we check by email)
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        try:
            user_obj = User.objects.get(email=email)
            username = user_obj.username
        except User.DoesNotExist:
            return Response(
                {"detail": "Invalid credentials."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        user = authenticate(username=username, password=password)

        if not user:
            return Response(
                {"detail": "Invalid credentials."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if role and user.role != role:
            return Response(
                {"detail": f"You do not have the required role: {role}"},
                status=status.HTTP_403_FORBIDDEN
            )

        token, _ = Token.objects.get_or_create(user=user)
        
        return Response({
            "access": token.key,
            "refresh": token.key, # For now using same token as placeholder
            "user": UserSerializer(user).data
        })


class UserMeView(views.APIView):
    """Returns the currently authenticated user details."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)
