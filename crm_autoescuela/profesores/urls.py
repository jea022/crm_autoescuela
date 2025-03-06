from django.urls import path
from . import views
from .views import profesor_create, profesor_update, profesor_delete

urlpatterns = [
    path('', views.profesores_list, name='profesores_list'),
    path('api/', views.profesores_list_api, name='profesor_list_api'),
    path('profesores/', views.profesores_list, name='profesor_list'),
    path('api/profesores/<int:id>/', views.profesor_detail, name='profesor_detail'),
    path('create/', profesor_create, name='profesor_create'),
    path('<int:id>/edit/', profesor_update, name='profesor_update'),
    path('<int:id>/delete/', profesor_delete, name='profesor_delete'),
]
    
