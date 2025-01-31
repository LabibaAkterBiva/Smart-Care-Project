from django.shortcuts import render
from .serializers import AppointmentSerializer
from .models import Appointment
from rest_framework import viewsets

# Create your views here.
class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        patient_id = self.request.query_params.get('patient_id')
        doctor_id = self.request.query_params.get('doctor_id')
        if patient_id is not None:
            queryset = queryset.filter(patient_id=patient_id)
        if doctor_id is not None:
            queryset = queryset.filter(doctor_id=doctor_id)
        return queryset