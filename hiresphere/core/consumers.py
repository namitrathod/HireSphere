import json
from channels.generic.websocket import AsyncWebsocketConsumer

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # In a real app, check self.scope['user'] to ensure it's a recruiter
        # For now, we subscribe everyone to 'recruiters' group for demo simplicity
        self.group_name = "recruiters"

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    # Receive message from group
    async def notification_message(self, event):
        data = event['data']
        await self.send(text_data=json.dumps(data))
