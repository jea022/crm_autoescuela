var ProfesorView = Backbone.View.extend({
    tagName: 'tr',
    
    events: {
        'click .btn-edit': 'editProfesor',     
        'click .delete-profesor': 'deleteProfesor'     
    },

    initialize: function(options) {
        this.profesorData = options.profesorData;
    },

    render: function() {
        var template = _.template($('#profesor-template').html());
        this.$el.html(template(this.profesorData));
        return this;
    },

    editProfesor: function(e) {
        e.preventDefault();
        console.log('Botón Editar presionado para profesor ID:', this.profesorData.id);
        Backbone.trigger('profesor:edit', this.profesorData);
    },

    deleteProfesor: function(e) {
        e.preventDefault();
        console.log('Botón Eliminar presionado para profesor ID:', this.profesorData.id);
        Backbone.trigger('profesor:delete', this.profesorData);
    }
});