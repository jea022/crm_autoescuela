var Profesor = Backbone.Model.extend({
    urlRoot: '/api/profesor',
    defaults: {
        id: null,
        nombre: '',
        apellido1: '',
        apellido2: '',
        email: '',
        direccionPostal: '',
        telefono: ''
    }
});