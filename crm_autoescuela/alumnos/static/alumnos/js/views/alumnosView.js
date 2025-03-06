var AlumnosView = Backbone.View.extend({
    el: '#alumnos-container',

    events: {
        'click #create-alumno': 'createAlumno'
    },

    initialize: function() {
        console.log('AlumnosView iniciado');
        this.listenTo(Backbone, 'filter:apply', this.filterAlumnos);
        this.listenTo(Backbone, 'filter:clear', this.showAllAlumnos);
        
        this.listenTo(Backbone, 'alumnos:reload', this.loadAlumnos);
        
        this.loadAlumnos();
    },

    loadAlumnos: function() {
        console.log('Cargando alumnos...');
        var self = this;
        
        $.ajax({
            url: '/alumnos/api/',
            method: 'GET',
            success: function(data) {
                console.log('Datos de alumnos recibidos:', data.length);
                $('#alumnos-list').empty();
                
                if (data.length === 0) {
                    $('#alumnos-list').append('<tr><td colspan="9" class="text-center">No hay alumnos registrados</td></tr>');
                    return;
                }
                
                data.forEach(function(alumnoData) {
                    var alumnoView = new AlumnoView({alumnoData: alumnoData});
                    $('#alumnos-list').append(alumnoView.render().el);
                });
                
                if (!window.filtroView) {
                    window.filtroView = new FiltroView();
                }
            },
            error: function(xhr, status, error) {
                console.error('Error al cargar alumnos:', error);
                $('#alumnos-list').append('<tr><td colspan="9" class="text-center">Error al cargar alumnos</td></tr>');
            }
        });
    },

    filterAlumnos: function(filters) {
        console.log('Aplicando filtros a lista de alumnos:', filters);
        
        let visibleCount = 0;
        
        $('#alumnos-list tr').each(function() {
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
            
            const profesorCell = $row.find('td:eq(7)');
            const profesorText = profesorCell.text().toLowerCase();
            
            let profesorId = null;
            if (profesorCell.data('profesor-id')) {
                profesorId = profesorCell.data('profesor-id');
            }
            
            const matches = 
                (filters.nombre === '' || nombre.includes(filters.nombre.toLowerCase())) &&
                (filters.apellido1 === '' || apellido1.includes(filters.apellido1.toLowerCase())) &&
                (filters.apellido2 === '' || apellido2.includes(filters.apellido2.toLowerCase())) &&
                (filters.email === '' || email.includes(filters.email.toLowerCase())) &&
                (filters.direccionPostal === '' || direccion.includes(filters.direccionPostal.toLowerCase())) &&
                (filters.telefono === '' || telefono.includes(filters.telefono.toLowerCase())) &&
                (filters.profesor === '' || (profesorId !== null && profesorId == filters.profesor));
            
            if (matches) {
                $row.show();
                visibleCount++;
            } else {
                $row.hide();
            }
        });
        
        this.showNoResultsMessage(visibleCount === 0);
    },
    
    showAllAlumnos: function() {
        console.log('Mostrando todos los alumnos');
        $('#alumnos-list tr').show();
        $('#no-results-row').hide();
    },
    
    showNoResultsMessage: function(show) {
        if (show) {
            if ($('#no-results-row').length === 0) {
                $('#alumnos-list').append('<tr id="no-results-row"><td colspan="8" class="text-center">No se encontraron alumnos</td></tr>');
            } else {
                $('#no-results-row').show();
            }
        } else {
            $('#no-results-row').hide();
        }
    },

    createAlumno: function(e) {
        e.preventDefault();
        console.log('Create button clicked');
        Backbone.trigger('alumno:create');
    }
});