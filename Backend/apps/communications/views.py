"""Views for the communications application."""

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.contrib.auth import get_user_model
from django.db.models import Q
from .models import Message, Notification, AdministrativeNote, Resource
from .serializers import (
    MessageSerializer, MessageCreateSerializer,
    NotificationSerializer, AdministrativeNoteSerializer,
    ResourceSerializer
)

User = get_user_model()


class MessageViewSet(viewsets.ModelViewSet):
    """Messages between users."""
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['create']:
            return MessageCreateSerializer
        return MessageSerializer

    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(
            Q(sender=user) | Q(recipient=user)
        ).select_related('sender', 'recipient').order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)
        # Create notification for recipient
        msg = serializer.instance
        Notification.objects.create(
            recipient=msg.recipient,
            sender=self.request.user,
            title=f"New message from {self.request.user.get_full_name() or self.request.user.username}",
            message=msg.content[:200],
            type='message',
            link='/messages',
        )

    @action(detail=False, methods=['get'])
    def inbox(self, request):
        """Messages received by current user."""
        msgs = Message.objects.filter(recipient=request.user).select_related('sender')
        serializer = MessageSerializer(msgs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def sent(self, request):
        """Messages sent by current user."""
        msgs = Message.objects.filter(sender=request.user).select_related('recipient')
        serializer = MessageSerializer(msgs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        msg = self.get_object()
        if msg.recipient == request.user:
            msg.is_read = True
            msg.save()
        return Response({'status': 'read'})

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        Message.objects.filter(recipient=request.user, is_read=False).update(is_read=True)
        return Response({'status': 'all read'})


class NotificationViewSet(viewsets.ModelViewSet):
    """Notifications for users."""
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(
            recipient=self.request.user
        ).select_related('sender').order_by('-created_at')

    def perform_create(self, serializer):
        """Admin/supervisor/jury can send notifications."""
        user = self.request.user
        recipients_data = self.request.data.get('recipients', [])
        audience = self.request.data.get('audience', '')

        if audience:
            role_map = {
                'students': 'student',
                'supervisors': 'supervisor',
                'juries': 'jury',
                'all': None,
            }
            role = role_map.get(audience)
            if role:
                recipients = User.objects.filter(role=role)
            else:
                recipients = User.objects.all()
            for recipient in recipients:
                Notification.objects.create(
                    recipient=recipient,
                    sender=user,
                    title=serializer.validated_data['title'],
                    message=serializer.validated_data['message'],
                    type=serializer.validated_data.get('type', 'info'),
                    link=serializer.validated_data.get('link', ''),
                )
        elif recipients_data:
            for rid in recipients_data:
                try:
                    recipient = User.objects.get(id=rid)
                    Notification.objects.create(
                        recipient=recipient,
                        sender=user,
                        title=serializer.validated_data['title'],
                        message=serializer.validated_data['message'],
                        type=serializer.validated_data.get('type', 'info'),
                        link=serializer.validated_data.get('link', ''),
                    )
                except User.DoesNotExist:
                    pass
        else:
            serializer.save(recipient=user, sender=user)

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        notif = self.get_object()
        notif.is_read = True
        notif.save()
        return Response({'status': 'read'})

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        Notification.objects.filter(recipient=request.user, is_read=False).update(is_read=True)
        return Response({'status': 'all read'})

    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        count = Notification.objects.filter(recipient=request.user, is_read=False).count()
        return Response({'count': count})


class AdministrativeNoteViewSet(viewsets.ModelViewSet):
    """Administrative notes from admin to users."""
    serializer_class = AdministrativeNoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return AdministrativeNote.objects.all()
        # Map role to audience filter
        role_to_audience = {
            'student': ['all', 'students'],
            'supervisor': ['all', 'supervisors'],
            'jury': ['all', 'juries'],
        }
        audiences = role_to_audience.get(user.role, ['all'])
        return AdministrativeNote.objects.filter(audience__in=audiences)

    def perform_create(self, serializer):
        if self.request.user.role != 'admin':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Only admins can create administrative notes.")
        serializer.save(author=self.request.user)
        # Create notifications for all target users
        note = serializer.instance
        role_map = {
            'students': 'student',
            'supervisors': 'supervisor',
            'juries': 'jury',
            'all': None,
        }
        role = role_map.get(note.audience)
        if role:
            recipients = User.objects.filter(role=role)
        else:
            recipients = User.objects.all()
        for recipient in recipients:
            if recipient != self.request.user:
                Notification.objects.create(
                    recipient=recipient,
                    sender=self.request.user,
                    title=f"Administrative Note: {note.title}",
                    message=note.content[:200],
                    type='info',
                    link='/administrative-notes',
                )

    def perform_update(self, serializer):
        if self.request.user.role != 'admin':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Only admins can edit notes.")
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user.role != 'admin':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Only admins can delete notes.")
        instance.delete()


class ResourceViewSet(viewsets.ModelViewSet):
    """Resource hub managed by admin."""
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_serializer_class(self):
        return ResourceSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Resource.objects.all()
        return Resource.objects.filter(is_public=True)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        if self.request.user.role != 'admin':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Only admins can add resources.")
        serializer.save(uploaded_by=self.request.user)

    def perform_destroy(self, instance):
        if self.request.user.role != 'admin':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Only admins can delete resources.")
        instance.delete()


class ContactableUsersView(APIView):
    """Return list of users the current user can message."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role == 'student':
            # Students can message their supervisor and admin
            from apps.students.models import Student
            try:
                profile = user.student_profile
                project = profile.projects.first()
                users = User.objects.filter(
                    Q(role='admin') |
                    (Q(id=project.supervisor_id) if project and project.supervisor_id else Q())
                ).exclude(id=user.id)
            except Exception:
                users = User.objects.filter(role='admin').exclude(id=user.id)
        elif user.role == 'supervisor':
            # Supervisors can message their students and admin
            student_user_ids = User.objects.filter(
                student_profile__projects__supervisor=user
            ).values_list('id', flat=True)
            users = User.objects.filter(
                Q(role='admin') | Q(id__in=student_user_ids)
            ).exclude(id=user.id)
        elif user.role == 'jury':
            users = User.objects.filter(role__in=['admin']).exclude(id=user.id)
        else:
            # Admin can message everyone
            users = User.objects.exclude(id=user.id)

        from .serializers import UserMiniSerializer
        serializer = UserMiniSerializer(users, many=True)
        return Response(serializer.data)
