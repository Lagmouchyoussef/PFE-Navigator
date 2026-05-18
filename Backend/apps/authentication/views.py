from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from .models import User
from .permissions import IsAdmin
from .serializers import (
    LoginSerializer, UserSerializer, UserCreateSerializer,
    UserUpdateSerializer, ChangePasswordSerializer,
)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data,
        })


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            token = RefreshToken(request.data.get('refresh'))
            token.blacklist()
        except (TokenError, KeyError):
            pass
        return Response(status=status.HTTP_204_NO_CONTENT)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def patch(self, request):
        serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserSerializer(request.user).data)


class SettingsView(APIView):
    """Alias of MeView for profile/settings updates."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def patch(self, request):
        serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserSerializer(request.user).data)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()
        return Response({'detail': 'Password updated successfully.'})


class UsersListView(APIView):
    """Returns list of users contactable by the current user (for messaging)."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        role = request.user.role
        if role == 'student':
            allowed_roles = ['admin', 'supervisor', 'student']
        else:
            allowed_roles = ['admin', 'supervisor', 'student', 'jury']

        queryset = User.objects.filter(role__in=allowed_roles, is_active=True).exclude(id=request.user.id)
        return Response([
            {
                'id': u.id,
                'email': u.email,
                'first_name': u.first_name,
                'last_name': u.last_name,
                'name': f'{u.first_name} {u.last_name}'.strip(),
                'role': u.role,
                'institutional_id': u.institutional_id,
            }
            for u in queryset
        ])


class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdmin]

    def get_queryset(self):
        queryset = User.objects.all()
        role = self.request.query_params.get('role')
        if role:
            queryset = queryset.filter(role=role)
        return queryset

    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        if self.action in ('update', 'partial_update'):
            return UserUpdateSerializer
        return UserSerializer

    @action(detail=True, methods=['post'], url_path='toggle-active')
    def toggle_active(self, request, pk=None):
        user = self.get_object()
        user.is_active = not user.is_active
        user.save()
        return Response(UserSerializer(user).data)

    @action(detail=True, methods=['post'], url_path='reset-password')
    def reset_password(self, request, pk=None):
        user = self.get_object()
        new_password = request.data.get('password')
        if not new_password or len(new_password) < 8:
            return Response({'detail': 'Password must be at least 8 characters.'}, status=400)
        user.set_password(new_password)
        user.save()
        return Response({'detail': 'Password reset successfully.'})

    @action(detail=False, methods=['get'], url_path='supervisors')
    def supervisors(self, request):
        users = User.objects.filter(role='supervisor', is_active=True)
        return Response(UserSerializer(users, many=True).data)

    @action(detail=False, methods=['get'], url_path='jury_members')
    def jury_members(self, request):
        users = User.objects.filter(role='jury', is_active=True)
        return Response(UserSerializer(users, many=True).data)

    @action(detail=False, methods=['get'], url_path='students')
    def students(self, request):
        users = User.objects.filter(role='student', is_active=True)
        return Response(UserSerializer(users, many=True).data)
