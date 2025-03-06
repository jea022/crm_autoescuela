from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from .models import Profesor
from .forms import ProfesorForm
import json

def profesores_list(request):
    return render(request, 'profesores/profesores_list.html')

def profesores_list_api(request):
    profesores = Profesor.objects.all()
    data = []
    
    for profesor in profesores:
        alumnos = profesor.alumnos.all()
        alumnos_data = []
        
        for alumno in alumnos:
            alumnos_data.append({
                "id": alumno.id,
                "nombre": alumno.nombre,
                "apellido1": alumno.apellido1
            })
        
        data.append({
            "id": profesor.id, 
            "nombre": profesor.nombre, 
            "apellido1": profesor.apellido1, 
            "apellido2": profesor.apellido2, 
            "email": profesor.email, 
            "direccionPostal": profesor.direccionPostal, 
            "telefono": profesor.telefono,
            "alumnos": alumnos_data
        })
    
    return JsonResponse(data, safe=False)

def profesor_detail(request, id):
    profesor = get_object_or_404(Profesor, id=id)
    
    alumnos = profesor.alumnos.all()
    alumnos_data = []
    
    for alumno in alumnos:
        alumnos_data.append({
            "id": alumno.id,
            "nombre": alumno.nombre,
            "apellido1": alumno.apellido1
        })
    
    data = {
        "id": profesor.id, 
        "nombre": profesor.nombre, 
        "apellido1": profesor.apellido1, 
        "apellido2": profesor.apellido2, 
        "email": profesor.email, 
        "direccionPostal": profesor.direccionPostal, 
        "telefono": profesor.telefono,
        "alumnos": alumnos_data
    }
    
    return JsonResponse(data)

def profesor_create(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            form = ProfesorForm(data)
            if form.is_valid():
                profesor = form.save()
                if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                    return JsonResponse({'id': profesor.id, 'nombre': profesor.nombre, 'apellido1': profesor.apellido1, 'apellido2': profesor.apellido2, 'email': profesor.email, 'direccionPostal': profesor.direccionPostal, 'telefono': profesor.telefono}, status=201)
                return redirect('profesores_list')
            else:
                if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                    return JsonResponse({'error': form.errors}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    else:
        form = ProfesorForm()
    return render(request, 'profesores/profesor_form.html', {'form': form})

def profesor_update(request, id):
    profesor = get_object_or_404(Profesor, id=id)
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            form = ProfesorForm(data, instance=profesor)
            if form.is_valid():
                profesor = form.save()
                if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                    return JsonResponse({'id': profesor.id, 'nombre': profesor.nombre, 'apellido1': profesor.apellido1, 'apellido2': profesor.apellido2, 'email': profesor.email, 'direccionPostal': profesor.direccionPostal, 'telefono': profesor.telefono}, status=200)
                return redirect('profesores_list')
            else:
                if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                    return JsonResponse({'error': form.errors}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    else:
        form = ProfesorForm(instance=profesor)
    return render(request, 'profesores/profesor_form.html', {'form': form})

def profesor_delete(request, id):
    profesor = get_object_or_404(Profesor, id=id)
    if request.method == 'POST':
        profesor.delete()
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({'id': id}, status=200)
        return redirect('profesores_list')
    return render(request, 'profesores/profesor_confirm_delete.html', {'profesor': profesor})