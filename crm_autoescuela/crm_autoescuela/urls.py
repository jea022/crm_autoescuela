from django.contrib import admin
from django.urls import path, include
from crm_autoescuela.views import home, registro, login_view, logout_view, dashboard

urlpatterns = [
    path('admin/', admin.site.urls),
    path('registro/', registro, name='registro'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('', home, name='home'),  
    path('dashboard/', dashboard, name='dashboard'),
    path('alumnos/', include('alumnos.urls')),
    path('profesores/', include('profesores.urls')),
]