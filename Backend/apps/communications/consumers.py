"""WebSocket consumers for notifications and real-time chat."""

from channels.generic.websocket import AsyncJsonWebsocketConsumer


class NotificationConsumer(AsyncJsonWebsocketConsumer):
    """Pushes targeted notifications to a single user.

    Client connects to: ws://.../ws/notifications/?token=<access_token>
    The JWTAuthMiddleware in shared/ws_middleware.py authenticates the token
    and populates scope["user"] before this consumer runs.
    """

    async def connect(self):
        user = self.scope.get("user")
        if not user or user.is_anonymous:
            await self.close(code=4001)
            return
        self.group_name = f"user_{user.id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        await self.send_json({"event": "connected", "user_id": user.id})

    async def disconnect(self, code):
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive_json(self, content, **kwargs):
        # Heartbeat only — notifications are server-pushed
        await self.send_json({"event": "heartbeat"})

    # Called by group_send with type "push.notification"
    async def push_notification(self, event):
        await self.send_json(event["payload"])


class ChatConsumer(AsyncJsonWebsocketConsumer):
    """Real-time direct messaging between users.

    Client connects to: ws://.../ws/messages/?token=<access_token>
    """

    async def connect(self):
        user = self.scope.get("user")
        if not user or user.is_anonymous:
            await self.close(code=4001)
            return
        self.group_name = f"user_{user.id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        await self.send_json({"event": "connected", "user_id": user.id})

    async def disconnect(self, code):
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive_json(self, content, **kwargs):
        """Client-side send — relay to receiver's group."""
        action = content.get("action")
        if action == "send_message":
            payload = content.get("payload", {})
            receiver_id = payload.get("receiver_id")
            if receiver_id:
                await self.channel_layer.group_send(
                    f"user_{receiver_id}",
                    {"type": "chat.message", "payload": payload},
                )
                await self.send_json({"event": "sent"})

    # Called by group_send with type "chat.message"
    async def chat_message(self, event):
        await self.send_json({"event": "new_message", **event["payload"]})
