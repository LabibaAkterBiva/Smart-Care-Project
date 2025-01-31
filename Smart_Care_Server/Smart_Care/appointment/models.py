
from django.db import models
from patient.models import Patient
from doctor.models import Doctor, AvailableTime

# Create your models here.
APPOINTMENT_STATUS = [
    ('Pending', 'Pending'),
    ('Running', 'Running'),
    ('Completed', 'Completed'),
]
APPOINTMENT_TYPES = [
    ('Offline', 'Offline'),
    ('Online', 'Online'),
]

class Appointment(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    appointment_type = models.CharField(max_length=10, choices=APPOINTMENT_TYPES)
    appointment_status = models.CharField(max_length=10, choices=APPOINTMENT_STATUS, default='Pending')
    created = models.DateTimeField(auto_now_add=True)
    symptom = models.TextField()
    time = models.ForeignKey(AvailableTime, on_delete=models.CASCADE)
    cancel = models.BooleanField(default=False)
    
    def __str__(self):
        return f'{self.patient} - {self.doctor} - {self.time}'
