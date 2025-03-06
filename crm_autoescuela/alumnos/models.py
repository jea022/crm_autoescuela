from django.db import models
from profesores.models import Profesor

class Alumno(models.Model):
    nombre = models.CharField(max_length=100)
    apellido1 = models.CharField(max_length=100)
    apellido2 = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(unique=True)
    direccionPostal = models.CharField(max_length=255, blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    profesor = models.ForeignKey(Profesor, on_delete=models.SET_NULL, blank=True, null=True, related_name='alumnos')

    def __str__(self):
        return f'{self.nombre} {self.apellido1}'