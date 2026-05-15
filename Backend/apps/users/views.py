from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, viewsets
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, get_user_model
from .serializers import UserSerializer

User = get_user_model()


class LoginView(APIView):
    """User login endpoint."""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        """Handle user login."""
        identifier = request.data.get('email')
        password = request.data.get('password')
        role = request.data.get('role')

        if not identifier or not password:
            return Response(
                {"detail": "Please provide both email or ID and password."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Allow login by email, institutional ID, or username
        from django.contrib.auth import get_user_model
        User = get_user_model()

        user_obj = None
        if identifier:
            user_obj = User.objects.filter(email__iexact=identifier).first()
            if not user_obj:
                user_obj = User.objects.filter(institutional_id__iexact=identifier).first()
            if not user_obj:
                user_obj = User.objects.filter(username__iexact=identifier).first()

        if not user_obj:
            return Response(
                {"detail": "Invalid credentials."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        username = user_obj.username

        user = authenticate(username=username, password=password)

        if not user:
            return Response(
                {"detail": "Invalid credentials."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if role and user.role != role:
            return Response(
                {"detail": f"Unauthorized role: {role}"},
                status=status.HTTP_403_FORBIDDEN
            )

        token, _ = Token.objects.get_or_create(user=user)
        
        return Response({
            "access": token.key,
            "refresh": token.key,
            "user": UserSerializer(user).data
        }, status=status.HTTP_200_OK)


class UserMeView(APIView):
    """Returns currently logged in user info."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class LogoutView(APIView):
    """User logout endpoint."""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """Handle user logout."""
        try:
            request.user.auth_token.delete()
        except:
            pass
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)


class UserViewSet(viewsets.ModelViewSet):
    """ViewSet for user management (admin only)."""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Only admins can see all users
        if self.request.user.role == 'admin':
            return User.objects.all()
        # Other users can only see their own profile
        return User.objects.filter(id=self.request.user.id)
    
    def list(self, request):
        """List users - only available to admins."""
        if request.user.role != 'admin':
            return Response(
                {"detail": "Only admins can view all users."},
                status=status.HTTP_403_FORBIDDEN
            )
        users = self.get_queryset()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
