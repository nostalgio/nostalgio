from django.core.mail import send_mail
from django.conf import settings

from rest_framework import viewsets, status
from rest_framework.decorators import detail_route, list_route
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer

from .models import QuickSend
from .serializers import QuickSendSerializer


class QuickSendViewSet(viewsets.ModelViewSet):
    queryset = QuickSend.objects.all()
    serializer_class = QuickSendSerializer

    def create(self, request, *args, **kwargs):
        customer_name = request.data.get('name')
        customer_email = request.data.get('email')
        quicksend = QuickSend(reason=request.data.get('reason'))
        reason = quicksend.get_reason_display()

        line_break_txt = "\n\n"
        line_break_html = "<br><br>"
        msg_txt = """
                New inquiry from <strong>{0}</strong> about \"{1}.\" {3}
                Client Email: <a href=\"mailto:{2}\">{2}</a> {3}
                """.format(customer_name, reason, customer_email,
                line_break_txt)

        msg_html = """
                New inquiry from <strong>{0}</strong> about \"{1}.\" {3}
                Client Email: <a href=\"mailto:{2}\">{2}</a> {3}
                """.format(customer_name, reason, customer_email,
                line_break_html)

        send_mail(subject="Quick Form Inquiry", message=msg_txt,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=['joshua@nostalg.io'], fail_silently=True,
                html_message=msg_html)

        return super().create(request, *args, **kwargs)