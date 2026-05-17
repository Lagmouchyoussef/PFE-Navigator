from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, viewsets, authentication
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from rest_framework.throttling import AnonRateThrottle
from django.contrib.auth import authenticate, get_user_model
from .serializers import UserSerializer

User = get_user_model()

_INVALID_CREDENTIALS_MSG = "Invalid credentials."


class LoginRateThrottle(AnonRateThrottle):
    rate = '5/minute'
    scope = 'login'


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [LoginRateThrottle]

    def post(self, request):
        identifier = request.data.get('email', '').strip()
        password = request.data.get('password', '')
        role = request.data.get('role', '').strip()

        if not identifier or not password:
            return Response(
                {"detail": "Please provide both email or ID and password."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user_obj = (
            User.objects.filter(email__iexact=identifier).first() or
            User.objects.filter(institutional_id__iexact=identifier).first() or
            User.objects.filter(username__iexact=identifier).first()
        )

        # Always run authenticate to prevent timing attacks
        auth_username = user_obj.username if user_obj else identifier
        user = authenticate(username=auth_username, password=password)

        if not user or not user_obj:
            return Response({"detail": _INVALID_CREDENTIALS_MSG}, status=status.HTTP_401_UNAUTHORIZED)

        # Check if account is active
        if not user.is_active or not getattr(user, 'is_active_user', True):
            return Response({"detail": "This account is disabled."}, status=status.HTTP_403_FORBIDDEN)

        # Role must be provided and must match the user's actual role
        if not role:
            return Response({"detail": "Role is required."}, status=status.HTTP_400_BAD_REQUEST)

        if user.role != role:
            return Response({"detail": _INVALID_CREDENTIALS_MSG}, status=status.HTTP_401_UNAUTHORIZED)

        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            "access": token.key,
            "refresh": token.key,
            "user": UserSerializer(user).data
        })


class UserMeView(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            request.user.auth_token.delete()
        except Exception:
            pass
        return Response({'message': 'Logout successful'})


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'admin':
            role = self.request.query_params.get('role')
            qs = User.objects.all().order_by('role', 'last_name', 'first_name')
            if role:
                qs = qs.filter(role=role)
            return qs
        return User.objects.filter(id=self.request.user.id)

    def list(self, request):
        if request.user.role != 'admin':
            return Response({"detail": "Only admins can view all users."}, status=status.HTTP_403_FORBIDDEN)
        serializer = UserSerializer(self.get_queryset(), many=True)
        return Response(serializer.data)

    def create(self, request):
        if request.user.role != 'admin':
            return Response({"detail": "Only admins can create users."}, status=status.HTTP_403_FORBIDDEN)
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        if request.user.role != 'admin':
            return Response({"detail": "Only admins can delete users."}, status=status.HTTP_403_FORBIDDEN)
        user = self.get_object()
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'])
    def supervisors(self, request):
        """List all supervisors."""
        users = User.objects.filter(role='supervisor').order_by('last_name')
        return Response(UserSerializer(users, many=True).data)

    @action(detail=False, methods=['get'])
    def jury_members(self, request):
        """List all jury members."""
        users = User.objects.filter(role='jury').order_by('last_name')
        return Response(UserSerializer(users, many=True).data)

    @action(detail=False, methods=['get'])
    def students(self, request):
        """List all students."""
        users = User.objects.filter(role='student').order_by('last_name')
        return Response(UserSerializer(users, many=True).data)
