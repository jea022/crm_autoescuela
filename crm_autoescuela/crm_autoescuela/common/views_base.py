from django.views.generic import ListView, CreateView, UpdateView, DeleteView, DetailView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.contrib import messages

class BaseListView(LoginRequiredMixin, ListView):
    """Vista base para listar registros"""
    template_name = None 
    model = None 
    context_object_name = 'objects'
    paginate_by = 10
    
    def get_queryset(self):
        queryset = super().get_queryset()
        search_query = self.request.GET.get('q')
        if search_query:
            search_fields = getattr(self, 'search_fields', ['nombre'])
            filters = {}
            for field in search_fields:
                filters[f'{field}__icontains'] = search_query
            queryset = queryset.filter(**filters)
        return queryset
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['search_query'] = self.request.GET.get('q', '')
        return context

class BaseCreateView(LoginRequiredMixin, CreateView):
    """Vista base para crear registros"""
    template_name = None  
    model = None  
    form_class = None  
    success_url = None 
    
    def form_valid(self, form):
        response = super().form_valid(form)
        messages.success(self.request, f'{self.model._meta.verbose_name} creado correctamente.')
        return response

class BaseUpdateView(LoginRequiredMixin, UpdateView):
    """Vista base para actualizar registros"""
    template_name = None  
    model = None  
    form_class = None  
    success_url = None  
    
    def form_valid(self, form):
        response = super().form_valid(form)
        messages.success(self.request, f'{self.model._meta.verbose_name} actualizado correctamente.')
        return response

class BaseDeleteView(LoginRequiredMixin, DeleteView):
    """Vista base para eliminar registros"""
    template_name = None  
    model = None  
    success_url = None  
    
    def delete(self, request, *args, **kwargs):
        response = super().delete(request, *args, **kwargs)
        messages.success(self.request, f'{self.model._meta.verbose_name} eliminado correctamente.')
        return response

class BaseDetailView(LoginRequiredMixin, DetailView):
    """Vista base para ver detalles de registros"""
    template_name = None 
    model = None  
    context_object_name = 'object'