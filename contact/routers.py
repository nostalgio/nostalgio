from django.conf.urls import url, include
from rest_framework import routers
from . import viewsets


router = routers.DefaultRouter(trailing_slash=False)
router.register(r'quicksend', viewsets.QuickSendViewSet, 'quicksend')
router.register(r'quickquote', viewsets.QuickQuoteViewSet, 'quickquote')

urlpatterns = [
    url(r'^', include(router.urls)),
]