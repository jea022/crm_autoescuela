var AlumnosView = Backbone.View.extend({
    el: '#alumnos-list',

    initialize: function(){
        console.log('AlumnosView initialized');
        this.alumnos = [];
        this.loadAlumnos();  // Cargar los alumnos al inicializar
    },

    events: {
        'click #create-alumno': 'createAlumno'
    },

    

    createAlumno: function() {
        console.log('Create button clicked');
        window.location.href = '/alumnos/create/';
    },
    
    render: function() {
        console.log('Rendering AlumnosView with', this.alumnos.length, 'alumnos');
        var self = this;
        this.$('tbody').empty();  // Limpiar la tabla antes de renderizar

        this.alumnos.forEach(function(alumno) {
            console.log('Rendering AlumnoView for alumno:', alumno.toJSON());
            var view = new AlumnoView({ model: alumno });
            self.$('tbody').append(view.render().$el);  // Agregar cada fila renderizada al tbody
        });

        console.log('AlumnosView rendered');
    }
});
