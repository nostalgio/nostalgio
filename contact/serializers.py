from rest_framework import serializers

from .models import QuickSend, QuickQuote


class QuickSendSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuickSend
        fields = ('reason', 'name', 'email')


class QuickQuoteSerializer(serializers.ModelSerializer):
    """docstring for QuickQuoteSerializer"""
    class Meta:
        model = QuickQuote
        fields = ('name', 'email', 'phone', 'project')
        