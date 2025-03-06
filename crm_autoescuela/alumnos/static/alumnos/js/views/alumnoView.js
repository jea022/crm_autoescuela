var AlumnoView = Backbone.View.extend({
    tagName: 'tr',
    template: _.template($('#alumno-template').html()),

    events: {
        'click .btn-warning': 'editAlumno',     
        'click .btn-danger': 'deleteAlumno'     
    },

    initialize: function(options) {
        this.alumnoData = options.alumnoData;
    },

    render: function() {
        this.$el.html(this.template(this.alumnoData));
        
       
        if (this.alumnoData.profesor) {
            this.$el.find('td:eq(7)').attr('data-profesor-id', this.alumnoData.profesor.id);
        }
        
        return this;
    },

    editAlumno: function(e) {
        e.preventDefault();
        console.log('Botón Editar presionado para alumno ID:', this.alumnoData.id);
        Backbone.trigger('alumno:edit', this.alumnoData);
    },

    deleteAlumno: function(e) {
        e.preventDefault();
        console.log('Botón Eliminar presionado para alumno ID:', this.alumnoData.id);
        Backbone.trigger('alumno:delete', this.alumnoData);
    }
});