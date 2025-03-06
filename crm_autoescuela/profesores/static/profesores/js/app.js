$(document).ready(function() {
    console.log('Inicializando aplicación de profesores');
    
    new ProfesoresView();
    
    try {
        console.log('Inicializando modales...');
        CreateProfesorModal.init();
        EditProfesorModal.init();
        DeleteProfesorModal.init();
        console.log('Modales inicializados correctamente');
    } catch (e) {
        console.error('Error al inicializar modales:', e);
    }
    
    Backbone.on('profesor:create', function() {
        console.log('Evento profesor:create disparado');
    });
    
    Backbone.on('profesor:edit', function(data) {
        console.log('Evento profesor:edit disparado para profesor ID:', data ? data.id : 'undefined');
    });
    
    Backbone.on('profesor:delete', function(data) {
        console.log('Evento profesor:delete disparado para profesor ID:', data ? data.id : 'undefined');
    });
});

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