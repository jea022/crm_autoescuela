var FiltroView = Backbone.View.extend({
    el: '#search-container',
    
    events: {
        'keyup .filtro-alumno': 'debouncedFilter',
        'change #filter-profesor': 'debouncedFilter',  
        'click #apply-filters': 'applyFilters',
        'click #clear-filters': 'clearFilters'
    },
    
    initialize: function() {
        console.log('FiltroView initialized');
        this.loadProfesores(); 
    },
    
    loadProfesores: function() {
        console.log('Cargando profesores para el filtro...');
        
        fetch('/profesores/api/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar profesores: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                console.log('Profesores cargados para filtro:', data);
                
                const select = document.getElementById('filter-profesor');
                
                data.forEach(profesor => {
                    const option = document.createElement('option');
                    option.value = profesor.id;
                    option.textContent = `${profesor.nombre} ${profesor.apellido1}`;
                    select.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error cargando profesores para filtro:', error);
            });
    },
    
    debouncedFilter: function(e) {
        clearTimeout(this.debounceTimeout);
        var self = this;
        this.debounceTimeout = setTimeout(function() {
            self.applyFilters();
        }, 100); 
    },
    
    applyFilters: function() {
        console.log('Aplicando filtros...');
        
        var filters = {
            nombre: $('#filter-nombre').val().toLowerCase(),
            apellido1: $('#filter-apellido1').val().toLowerCase(),
            apellido2: $('#filter-apellido2').val().toLowerCase(),
            email: $('#filter-email').val().toLowerCase(),
            direccionPostal: $('#filter-direccion').val().toLowerCase(),
            telefono: $('#filter-telefono').val().toLowerCase(),
            profesor: $('#filter-profesor').val() 
        };
        
        console.log('Filtros activos:', filters);
        
        Backbone.trigger('filter:apply', filters);
        
        return false;
    },
    
    clearFilters: function() {
        console.log('Limpiando filtros...');
        
        $('#filter-nombre, #filter-apellido1, #filter-apellido2, #filter-email, #filter-direccion, #filter-telefono').val('');
        $('#filter-profesor').val(''); 
        
        Backbone.trigger('filter:clear');
        
        return false;
    }
});