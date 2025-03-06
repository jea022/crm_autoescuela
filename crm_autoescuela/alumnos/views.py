from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from .models import Alumno
from .forms import AlumnoForm
from profesores.models import Profesor
import json

def alumnos_list(request):
    return render(request, 'alumnos/alumnos_list.html')

def alumnos_list_api(request):
    alumnos = Alumno.objects.all()
    data = []
    for alumno in alumnos:
        profesor_info = None
        if alumno.profesor:
            profesor_info = {"id": alumno.profesor.id, "nombre": alumno.profesor.nombre, "apellido1": alumno.profesor.apellido1}
        
        data.append({
            "id": alumno.id, 
            "nombre": alumno.nombre, 
            "apellido1": alumno.apellido1, 
            "apellido2": alumno.apellido2, 
            "email": alumno.email, 
            "direccionPostal": alumno.direccionPostal, 
            "telefono": alumno.telefono,
            "profesor": profesor_info
        })
    return JsonResponse(data, safe=False)

def alumno_detail(request, id):
    alumno = get_object_or_404(Alumno, id=id)
    profesor_info = None
    if alumno.profesor:
        profesor_info = {"id": alumno.profesor.id, "nombre": alumno.profesor.nombre, "apellido1": alumno.profesor.apellido1}
    
    data = {
        "id": alumno.id, 
        "nombre": alumno.nombre, 
        "apellido1": alumno.apellido1, 
        "apellido2": alumno.apellido2, 
        "email": alumno.email, 
        "direccionPostal": alumno.direccionPostal, 
        "telefono": alumno.telefono,
        "profesor": profesor_info
    }
    return JsonResponse(data)

def alumno_create(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("Datos recibidos para creación:", data)  
            
            profesor_id = data.pop('profesor', None)  
            
            alumno = Alumno(
                nombre=data.get('nombre'),
                apellido1=data.get('apellido1'),
                apellido2=data.get('apellido2'),
                email=data.get('email'),
                direccionPostal=data.get('direccionPostal'),
                telefono=data.get('telefono')
            )
            
            if profesor_id is not None:
                try:
                    profesor = Profesor.objects.get(id=profesor_id)
                    alumno.profesor = profesor
                    print(f"Profesor asignado: ID {profesor.id}, Nombre: {profesor.nombre}")
                except Profesor.DoesNotExist:
                    print(f"Error: Profesor con ID {profesor_id} no encontrado")
                    return JsonResponse({'error': f'El profesor con ID {profesor_id} no existe'}, status=400)
            alumno.save()
            
            profesor_info = None
            if alumno.profesor:
                profesor_info = {
                    "id": alumno.profesor.id, 
                    "nombre": alumno.profesor.nombre, 
                    "apellido1": alumno.profesor.apellido1
                }
            print(f"Alumno creado. Profesor asignado: {profesor_info}")
            
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({
                    'id': alumno.id, 
                    'nombre': alumno.nombre, 
                    'apellido1': alumno.apellido1, 
                    'apellido2': alumno.apellido2, 
                    'email': alumno.email, 
                    'direccionPostal': alumno.direccionPostal, 
                    'telefono': alumno.telefono,
                    'profesor': profesor_info
                }, status=201)
            return redirect('alumnos_list')
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            print(f"Error inesperado: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
    else:
        form = AlumnoForm()
    return render(request, 'alumnos/alumno_form.html', {'form': form})

def alumno_update(request, id):
    alumno = get_object_or_404(Alumno, id=id)
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("Datos recibidos para actualización:", data)  
            
            profesor_id = data.pop('profesor', None)  
            
            alumno.nombre = data.get('nombre', alumno.nombre)
            alumno.apellido1 = data.get('apellido1', alumno.apellido1)
            alumno.apellido2 = data.get('apellido2', alumno.apellido2)
            alumno.email = data.get('email', alumno.email)
            alumno.direccionPostal = data.get('direccionPostal', alumno.direccionPostal)
            alumno.telefono = data.get('telefono', alumno.telefono)
            
            if profesor_id is not None:
                try:
                    profesor = Profesor.objects.get(id=profesor_id)
                    alumno.profesor = profesor
                    print(f"Profesor asignado: ID {profesor.id}, Nombre: {profesor.nombre}")
                except Profesor.DoesNotExist:
                    print(f"Error: Profesor con ID {profesor_id} no encontrado")
                    return JsonResponse({'error': f'El profesor con ID {profesor_id} no existe'}, status=400)
            else:
                alumno.profesor = None
                print("Profesor establecido a None")
            alumno.save()
            
            profesor_info = None
            if alumno.profesor:
                profesor_info = {
                    "id": alumno.profesor.id, 
                    "nombre": alumno.profesor.nombre, 
                    "apellido1": alumno.profesor.apellido1
                }
            print(f"Alumno guardado. Profesor asignado: {profesor_info}")
            
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({
                    'id': alumno.id, 
                    'nombre': alumno.nombre, 
                    'apellido1': alumno.apellido1, 
                    'apellido2': alumno.apellido2, 
                    'email': alumno.email, 
                    'direccionPostal': alumno.direccionPostal, 
                    'telefono': alumno.telefono,
                    'profesor': profesor_info
                }, status=200)
            return redirect('alumnos_list')
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            print(f"Error inesperado: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
    else:
        form = AlumnoForm(instance=alumno)
    return render(request, 'alumnos/alumno_form.html', {'form': form})

def alumno_delete(request, id):
    alumno = get_object_or_404(Alumno, id=id)
    if request.method == 'POST':
        alumno.delete()
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({'id': id}, status=200)
        return redirect('alumnos_list')
    return render(request, 'alumnos/alumno_confirm_delete.html', {'alumno': alumno})