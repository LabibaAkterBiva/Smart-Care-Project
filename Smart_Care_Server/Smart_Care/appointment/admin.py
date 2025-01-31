
from typing import Any
from django.contrib import admin
from .models import Appointment
#for sending mail
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

# Register your models here.
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('patient_name', 'doctor_name', 'time')

    def doctor_name(self, obj):
        return obj.doctor.user.first_name + " " + obj.doctor.user.last_name

    def patient_name(self, obj):
        return obj.patient.user.first_name + " " + obj.patient.user.last_name
    
    def save_model(self, request, obj, form, change):
        obj.save()
        if obj.appointment_status == "Running" and obj.appointment_type == "Online":
            email_subject = 'Your Online Appointment is confirmed'
            email_body = render_to_string('appointment_confirm_mail.html',{'user': obj.patient.user, 'doctor': obj.doctor})
            email = EmailMultiAlternatives(email_subject, '', to=[obj.patient.user.email])
            email.attach_alternative(email_body, 'text/html')
            email.send()
            

admin.site.register(Appointment, AppointmentAdmin)
