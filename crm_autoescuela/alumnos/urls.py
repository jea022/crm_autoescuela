from django.urls import path
from . import views
from .views import alumno_create, alumno_update, alumno_delete


urlpatterns = [
    path('', views.alumnos_list, name='alumnos_list'),
    path('api/', views.alumnos_list_api, name='alumnos_list_api'),
    path('api/alumnos/<int:id>/', views.alumno_detail, name='alumno_detail'),
    path('create/', views.alumno_create, name='alumno_create'),
    path('<int:id>/edit/', views.alumno_update, name='alumno_update'),
    path('<int:id>/delete/', views.alumno_delete, name='alumno_delete'),
]