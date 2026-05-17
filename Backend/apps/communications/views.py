"""Views for the communications application."""

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.contrib.auth import get_user_model
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Message, Notification
from .serializers import MessageSerializer, NotificationSerializer, UserMiniSerializer

User = get_user_model()
channel_layer = get_channel_layer()


def _push_message(receiver_id: int, payload: dict):
    if channel_layer:
        async_to_sync(channel_layer.group_send)(
            f"user_{receiver_id}",
            {"type": "chat.message", "payload": payload},
        )


def _push_notification(user_id: int, payload: dict):
    if channel_layer:
        async_to_sync(channel_layer.group_send)(
            f"user_{user_id}",
            {"type": "push.notification", "payload": payload},
        )


class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["is_read", "project"]
    ordering = ["-created_at"]

    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(
            Q(sender=user) | Q(receiver=user)
        ).select_related("sender", "receiver")

    def perform_create(self, serializer):
        msg = serializer.save(sender=self.request.user)
        # Real-time push to receiver
        _push_message(msg.receiver.id, {
            "event": "new_message",
            "id": msg.id,
            "sender_id": msg.sender.id,
            "sender_name": msg.sender.get_full_name() or msg.sender.email,
            "content": msg.content,
            "created_at": msg.created_at.isoformat(),
        })
        # Persist notification
        Notification.objects.create(
            user=msg.receiver,
            title=f"New message from {msg.sender.get_full_name() or msg.sender.email}",
            message=msg.content[:200],
            type=Notification.TYPE_INFO,
            related_object_id=str(msg.id),
            related_object_type="message",
        )

    @action(detail=True, methods=["post"])
    def mark_read(self, request, pk=None):
        msg = self.get_object()
        if msg.receiver == request.user:
            msg.is_read = True
            msg.save(update_fields=["is_read"])
        return Response({"status": "read"})

    @action(detail=False, methods=["post"])
    def mark_all_read(self, request):
        Message.objects.filter(receiver=request.user, is_read=False).update(is_read=True)
        return Response({"status": "all read"})

    @action(detail=False, methods=["get"])
    def inbox(self, request):
        msgs = Message.objects.filter(receiver=request.user).select_related("sender").order_by("-created_at")
        return Response(MessageSerializer(msgs, many=True).data)

    @action(detail=False, methods=["get"])
    def sent(self, request):
        msgs = Message.objects.filter(sender=request.user).select_related("receiver").order_by("-created_at")
        return Response(MessageSerializer(msgs, many=True).data)

    @action(detail=False, methods=["get"])
    def unread_count(self, request):
        count = Message.objects.filter(receiver=request.user, is_read=False).count()
        return Response({"count": count})


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["is_read", "type"]
    ordering = ["-created_at"]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["post"])
    def mark_read(self, request, pk=None):
        notif = self.get_object()
        notif.is_read = True
        notif.save(update_fields=["is_read"])
        return Response({"status": "read"})

    @action(detail=False, methods=["post"])
    def mark_all_read(self, request):
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({"status": "all read"})

    @action(detail=False, methods=["get"])
    def unread_count(self, request):
        count = Notification.objects.filter(user=request.user, is_read=False).count()
        return Response({"count": count})


class ContactableUsersView(APIView):
    """Return users the current user is allowed to message."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role == "ADMIN":
            users = User.objects.exclude(id=user.id).order_by("last_name")
        elif user.role == "SUPERVISOR":
            student_ids = User.objects.filter(
                student_profile__supervisor__user=user
            ).values_list("id", flat=True)
            users = User.objects.filter(
                Q(role="ADMIN") | Q(id__in=student_ids)
            ).exclude(id=user.id)
        elif user.role == "STUDENT":
            try:
                sup_user_id = user.student_profile.supervisor.user.id if user.student_profile.supervisor else None
            except Exception:
                sup_user_id = None
            q = Q(role="ADMIN")
            if sup_user_id:
                q |= Q(id=sup_user_id)
            users = User.objects.filter(q).exclude(id=user.id)
        else:
            users = User.objects.filter(role="ADMIN").exclude(id=user.id)

        return Response(UserMiniSerializer(users, many=True).data)
