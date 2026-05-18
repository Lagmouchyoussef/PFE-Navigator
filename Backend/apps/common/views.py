from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.authentication.models import User
from .models import Subject, Message, Notification, AdminNote, Resource
from .serializers import (
    SubjectSerializer, MessageSerializer, NotificationSerializer,
    AdminNoteSerializer, ResourceSerializer,
)


class SubjectViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = SubjectSerializer
    queryset = Subject.objects.filter(status='available')


class MessageViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer
    http_method_names = ['get', 'post', 'delete', 'head', 'options']

    def get_queryset(self):
        user = self.request.user
        return (
            Message.objects.filter(sender=user) |
            Message.objects.filter(recipient=user)
        ).distinct().select_related('sender', 'recipient')

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

    @action(detail=True, methods=['post'], url_path='read')
    def mark_read(self, request, pk=None):
        message = self.get_object()
        if message.recipient == request.user:
            message.is_read = True
            message.save()
        return Response(MessageSerializer(message).data)

    @action(detail=False, methods=['post'], url_path='mark_all_read')
    def mark_all_read(self, request):
        Message.objects.filter(recipient=request.user, is_read=False).update(is_read=True)
        return Response(status=status.HTTP_204_NO_CONTENT)


class NotificationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)

    def perform_create(self, serializer):
        recipients = self.request.data.get('recipients', [])
        audience = self.request.data.get('audience', '')
        title = self.request.data.get('title', '')
        message_text = self.request.data.get('message', '')
        notif_type = self.request.data.get('type', 'info')
        link = self.request.data.get('link', '')

        target_users = []
        if recipients:
            target_users = list(User.objects.filter(id__in=recipients, is_active=True))
        elif audience == 'students':
            target_users = list(User.objects.filter(role='student', is_active=True))
        elif audience == 'supervisors':
            target_users = list(User.objects.filter(role='supervisor', is_active=True))
        elif audience == 'juries':
            target_users = list(User.objects.filter(role='jury', is_active=True))
        elif audience == 'all':
            target_users = list(User.objects.filter(is_active=True))

        if target_users:
            Notification.objects.bulk_create([
                Notification(
                    recipient=u,
                    title=title,
                    message=message_text,
                    type=notif_type,
                    link=link,
                )
                for u in target_users
            ])
        else:
            serializer.save(recipient=self.request.user)

    @action(detail=True, methods=['post'], url_path='read')
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response(NotificationSerializer(notification).data)

    @action(detail=False, methods=['post'], url_path='read-all')
    def mark_all_read(self, request):
        self.get_queryset().filter(is_read=False).update(is_read=True)
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminNoteViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = AdminNoteSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return AdminNote.objects.all()
        audience_map = {
            'student': ['all', 'students'],
            'supervisor': ['all', 'supervisors'],
            'jury': ['all', 'juries'],
        }
        allowed = audience_map.get(user.role, ['all'])
        return AdminNote.objects.filter(audience__in=allowed)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class ResourceViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ResourceSerializer

    def get_queryset(self):
        return Resource.objects.all()

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)
