from django.conf.urls import url, include
from rest_framework import routers
from . import viewsets


router = routers.DefaultRouter(trailing_slash=False)
router.register(r'quicksend', viewsets.QuickSendViewSet, 'quicksend')

urlpatterns = [
    url(r'^', include(router.urls)),
]