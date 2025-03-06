var AlumnoView = Backbone.View.extend({
    tagName: 'tr',

    
    initialize: function() {
        console.log('AlumnoView initialized');
        console.log('Model data at initialization:', this.model.toJSON());
        this.render();
    },

    myEvents: {
        'click .btn-edit': 'editAlumno',
        'click .delete-alumno': 'deleteAlumno'
    },

    
    editAlumno: function() {
        var id = this.model.get('id');
        console.log('Edit button clicked for ID:', id);
        window.location.href = '/alumnos/' + id + '/edit/';
    },

    deleteAlumno: function() {
        var id = this.model.get('id');
        console.log('Delete button clicked for ID:', id);
        if (confirm('¿Estás seguro de que deseas eliminar este alumno?')) {
            console.log('Alumno deletion confirmed for ID:', id);
            this.model.destroy({
                success: function() {
                    console.log('Alumno successfully deleted');
                    window.location.reload();
                },
                error: function() {
                    console.log('Error deleting alumno');
                }
            });
        } else {
            console.log('Alumno deletion cancelled for ID:', id);
        }
    },

    render: function() {
        console.log('Rendering AlumnoView for model:', this.model.toJSON());
        this.$el.html(this.template(this.model.toJSON()));
        console.log('AlumnoView rendered');
        return this;
    }
});
