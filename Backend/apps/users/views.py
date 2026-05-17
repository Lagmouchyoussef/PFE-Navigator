from django.contrib.auth import authenticate, get_user_model
from rest_framework import authentication, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView

from .serializers import UserSerializer

User = get_user_model()

_INVALID_CREDENTIALS_MSG = 'Invalid credentials.'


class LoginRateThrottle(AnonRateThrottle):
    rate = '5/minute'
    scope = 'login'


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [LoginRateThrottle]

    def post(self, request):
        identifier = request.data.get('email', '').strip()
        password = request.data.get('password', '')
        role = request.data.get('role', '').strip().upper()

        if not identifier or not password:
            return Response(
                {'detail': 'Please provide both email and password.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user_obj = (
            User.objects.filter(email__iexact=identifier).first()
            or User.objects.filter(institutional_id__iexact=identifier).first()
            or User.objects.filter(username__iexact=identifier).first()
        )

        if not user_obj:
            return Response({'detail': _INVALID_CREDENTIALS_MSG}, status=status.HTTP_401_UNAUTHORIZED)

        user = authenticate(request, username=user_obj.email, password=password)
        if not user:
            return Response({'detail': _INVALID_CREDENTIALS_MSG}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.is_active:
            return Response({'detail': 'This account is disabled.'}, status=status.HTTP_403_FORBIDDEN)

        if role and user.role != role:
            return Response({'detail': _INVALID_CREDENTIALS_MSG}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': UserSerializer(user).data,
            },
            status=status.HTTP_200_OK,
        )


class UserMeView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class LogoutView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get('refresh')
        if refresh_token:
            try:
                RefreshToken(refresh_token).blacklist()
            except TokenError:
                pass
        return Response({'detail': 'Logout successful'}, status=status.HTTP_200_OK)


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == User.ROLE_ADMIN:
            role = self.request.query_params.get('role')
            qs = User.objects.all().order_by('role', 'last_name', 'first_name')
            if role:
                qs = qs.filter(role=role.upper())
            return qs
        return User.objects.filter(id=self.request.user.id)

    def list(self, request, *args, **kwargs):
        if request.user.role != User.ROLE_ADMIN:
            return Response({'detail': 'Only admins can view all users.'}, status=status.HTTP_403_FORBIDDEN)
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        if request.user.role != User.ROLE_ADMIN:
            return Response({'detail': 'Only admins can create users.'}, status=status.HTTP_403_FORBIDDEN)
        return super().create(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if request.user.role != User.ROLE_ADMIN:
            return Response({'detail': 'Only admins can delete users.'}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)

    @action(detail=False, methods=['get'])
    def supervisors(self, request):
        users = User.objects.filter(role=User.ROLE_SUPERVISOR).order_by('last_name')
        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def jury_members(self, request):
        users = User.objects.filter(role=User.ROLE_JURY).order_by('last_name')
        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def students(self, request):
        users = User.objects.filter(role=User.ROLE_STUDENT).order_by('last_name')
        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data)
