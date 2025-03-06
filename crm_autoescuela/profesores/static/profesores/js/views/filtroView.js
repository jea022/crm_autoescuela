var FiltroView = Backbone.View.extend({
    el: '#search-container',
    
    events: {
        'keyup .filtro-profesor': 'debouncedFilter',
        'click #apply-filters': 'applyFilters',
        'click #clear-filters': 'clearFilters'
    },
    
    initialize: function() {
        console.log('FiltroView initialized');
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
            alumno: $('#filter-alumno').val().toLowerCase()  // Añadimos el filtro de alumno
        };
        
        console.log('Filtros activos:', filters);
        
        Backbone.trigger('filter:apply', filters);
        
        return false;
    },
    
    clearFilters: function() {
        console.log('Limpiando filtros...');
        
        $('#filter-nombre, #filter-apellido1, #filter-apellido2, #filter-email, #filter-direccion, #filter-telefono, #filter-alumno').val('');
        
        Backbone.trigger('filter:clear');
        
        return false;
    }
});