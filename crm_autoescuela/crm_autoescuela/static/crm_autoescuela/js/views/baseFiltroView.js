var BaseFiltroView = {
    initialize: function(options) {
        console.log('BaseFiltroView initialized');
        this.options = options || {};
        
        $('#apply-filters').click(this.applyFilters.bind(this));
        $('#clear-filters').click(this.clearFilters.bind(this));
        $('.filtro-comun').on('keyup', this.debouncedFilter.bind(this));
        
        if (this.options.loadProfesores) {
            this.loadProfesores();
        }
    },
    
    loadProfesores: function() {
        console.log('Cargando profesores para el filtro...');
        
        $.ajax({
            url: '/profesores/api/',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                console.log('Profesores cargados para filtro:', data);
                
                const select = document.getElementById('filter-profesor');
                if (select) {
                    data.forEach(function(profesor) {
                        const option = document.createElement('option');
                        option.value = profesor.id;
                        option.textContent = `${profesor.nombre} ${profesor.apellido1}`;
                        select.appendChild(option);
                    });
                }
            },
            error: function(xhr, status, error) {
                console.error('Error cargando profesores para filtro:', error);
            }
        });
    },
    
    debouncedFilter: function(e) {
        clearTimeout(this.debounceTimeout);
        var self = this;
        this.debounceTimeout = setTimeout(function() {
            self.applyFilters();
        }, 300);
    },
    
    getBaseFilters: function() {
        return {
            nombre: $('#filter-nombre').val().toLowerCase(),
            apellido1: $('#filter-apellido1').val().toLowerCase(),
            apellido2: $('#filter-apellido2').val().toLowerCase(),
            email: $('#filter-email').val().toLowerCase(),
            direccionPostal: $('#filter-direccion').val().toLowerCase(),
            telefono: $('#filter-telefono').val().toLowerCase()
        };
    },
    
    applyFilters: function() {
        console.log('BaseFiltroView.applyFilters - Debe ser implementado por clases hijas');
        return false;
    },
    
    clearFilters: function() {
        console.log('Limpiando filtros...');
        
        $('#filter-nombre, #filter-apellido1, #filter-apellido2, #filter-email, #filter-direccion, #filter-telefono').val('');
        
        if ($('#filter-profesor').length) $('#filter-profesor').val('');
        if ($('#filter-alumno').length) $('#filter-alumno').val('');
        
        $(document).trigger('filter:clear');
        
        return false;
    }
};