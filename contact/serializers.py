from rest_framework import serializers

from .models import QuickSend


class QuickSendSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuickSend
        fields = ('reason', 'name', 'email')