$(document).ready(function() {
    console.log('Inicializando aplicación');
    
    // Inicializar vista principal
    new AlumnosView();
    
    // Inicializar modales
    try {
        console.log('Inicializando modales...');
        CreateAlumnoModal.init();
        EditAlumnoModal.init();
        DeleteAlumnoModal.init();
        console.log('Modales inicializados correctamente');
    } catch (e) {
        console.error('Error al inicializar modales:', e);
    }
    
    // Escuchar eventos para depuración
    Backbone.on('alumno:create', function() {
        console.log('Evento alumno:create disparado');
    });
    
    Backbone.on('alumno:edit', function(data) {
        console.log('Evento alumno:edit disparado para alumno ID:', data ? data.id : 'undefined');
    });
    
    Backbone.on('alumno:delete', function(data) {
        console.log('Evento alumno:delete disparado para alumno ID:', data ? data.id : 'undefined');
    });
});

// Función para obtener el token CSRF
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}