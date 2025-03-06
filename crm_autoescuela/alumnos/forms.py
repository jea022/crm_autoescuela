from django import forms
from .models import Alumno

class AlumnoForm(forms.ModelForm):
    class Meta:
        model = Alumno
        fields = ['nombre', 'apellido1', 'apellido2', 'email', 'direccionPostal', 'telefono']