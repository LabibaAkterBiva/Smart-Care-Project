from django.db import models

# Create your models here.

class Service(models.Model):
    name = models.CharField(max_length=20)
    image = models.ImageField(upload_to='service/images/')
    description = models.TextField()
    def __str__(self):
        return self.name