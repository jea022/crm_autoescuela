from django import forms
from .models import Profesor

class ProfesorForm(forms.ModelForm):
    class Meta:
        model = Profesor
        fields = ['nombre', 'apellido1', 'apellido2', 'email', 'direccionPostal', 'telefono']