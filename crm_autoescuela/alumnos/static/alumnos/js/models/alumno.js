var Alumno = Backbone.Model.extend({
    urlRoot: '/api/alumnos',
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