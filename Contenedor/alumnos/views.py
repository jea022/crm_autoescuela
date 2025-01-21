from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def IndexView(request):
    """Esto es lapagina principal de la app"""
    return render(request, 'alumnos/index.html')