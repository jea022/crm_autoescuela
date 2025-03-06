var ProfesoresView = Backbone.View.extend({
    el: '#profesores-container',

    events: {
        'click #create-profesor': 'createProfesor',
    },

    initialize: function() {
        console.log('ProfesoresView iniciado');
        this.listenTo(Backbone, 'filter:apply', this.filterProfesores);
        this.listenTo(Backbone, 'filter:clear', this.showAllProfesores);
        
        this.listenTo(Backbone, 'profesores:reload', this.loadProfesores);
        
        this.loadProfesores();
    },

    loadProfesores: function() {
        console.log('Cargando profesores...');
        var self = this;
        
        $.ajax({
            url: '/profesores/api/',
            method: 'GET',
            success: function(data) {
                console.log('Datos de profesores recibidos:', data.length);
                $('#profesores-list').empty();
                
                if (data.length === 0) {
                    $('#profesores-list').append('<tr><td colspan="9" class="text-center">No hay profesores registrados</td></tr>');
                    return;
                }
                
                data.forEach(function(profesorData) {
                    var profesorView = new ProfesorView({profesorData: profesorData});
                    $('#profesores-list').append(profesorView.render().el);
                });
                
                if (!window.filtroView) {
                    window.filtroView = new FiltroView();
                }
            },
            error: function(xhr, status, error) {
                console.error('Error al cargar profesores:', error);
                $('#profesores-list').append('<tr><td colspan="9" class="text-center">Error al cargar profesores</td></tr>');
            }
        });
    },

    filterProfesores: function(filters) {
        console.log('Filtrando profesores con:', filters);
        let visibleCount = 0;
        
        $('#profesores-list tr').each(function() {
            const $row = $(this);
            
            if ($row.attr('id') === 'no-results-row') {
                return;
            }
            
            const nombre = $row.find('td:eq(1)').text().toLowerCase();
            const apellido1 = $row.find('td:eq(2)').text().toLowerCase();
            const apellido2 = $row.find('td:eq(3)').text().toLowerCase();
            const email = $row.find('td:eq(4)').text().toLowerCase();
            const direccion = $row.find('td:eq(5)').text().toLowerCase();
            const telefono = $row.find('td:eq(6)').text().toLowerCase();
            
            // Obtener el texto de la celda de alumnos (índice 7)
            const alumnosCell = $row.find('td:eq(7)').text().toLowerCase();
            
            const matches = 
                (filters.nombre === '' || nombre.includes(filters.nombre.toLowerCase())) &&
                (filters.apellido1 === '' || apellido1.includes(filters.apellido1.toLowerCase())) &&
                (filters.apellido2 === '' || apellido2.includes(filters.apellido2.toLowerCase())) &&
                (filters.email === '' || email.includes(filters.email.toLowerCase())) &&
                (filters.direccionPostal === '' || direccion.includes(filters.direccionPostal.toLowerCase())) &&
                (filters.telefono === '' || telefono.includes(filters.telefono.toLowerCase())) &&
                (filters.alumno === '' || alumnosCell.includes(filters.alumno.toLowerCase()));
                
            if (matches) {
                $row.show();
                visibleCount++;
            } else {
                $row.hide();
            }
        });
        
        this.showNoResultsMessage(visibleCount === 0);
    },
    
    showAllProfesores: function() {
        console.log('Mostrando todos los profesores');
        $('#profesores-list tr').show();
        $('#no-results-row').hide();
    },
    
    showNoResultsMessage: function(show) {
        if (show) {
            if ($('#no-results-row').length === 0) {
                $('#profesores-list').append('<tr id="no-results-row"><td colspan="9" class="text-center">No se encontraron profesores</td></tr>');
            } else {
                $('#no-results-row').show();
            }
        } else {
            $('#no-results-row').hide();
        }
    },

    createProfesor: function(e) {
        e.preventDefault();
        console.log('Create button clicked');
        Backbone.trigger('profesor:create');
    }
});