"""WebSocket consumer for real-time project updates."""

from channels.generic.websocket import AsyncJsonWebsocketConsumer


class ProjectUpdateConsumer(AsyncJsonWebsocketConsumer):
    """Sends live project status changes to the student.

    Client connects to: ws://.../ws/projects/?token=<access_token>
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
        await self.send_json({"event": "heartbeat"})

    # Called by group_send with type "project.updated"
    async def project_updated(self, event):
        await self.send_json({"event": "project_updated", **event["payload"]})
