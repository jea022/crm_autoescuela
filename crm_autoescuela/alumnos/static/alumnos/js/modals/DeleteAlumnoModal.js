var DeleteAlumnoModal = {
    init: function() {
        console.log('DeleteAlumnoModal inicializado');
        Backbone.on('alumno:delete', this.showModal, this);
        $('#confirm-delete-alumno').off('click').on('click', this.handleDelete);
        $('#deleteAlumnoModal').on('hidden.bs.modal', function () {
            document.querySelector('#focus-trap').focus();
        });
    },

    showModal: function(alumnoData) {
        console.log('Mostrando modal de eliminación');
        $('#delete-id').val(alumnoData.id);
        $('#delete-error-message').addClass('d-none').text('');
        var modal = new bootstrap.Modal(document.getElementById('deleteAlumnoModal'));
        modal.show();
    },

    handleDelete: function() {
        console.log('Procesando eliminación de alumno');
        var alumnoId = $('#delete-id').val();
        console.log('ID del alumno a eliminar:', alumnoId);

        $.ajax({
            url: '/alumnos/' + alumnoId + '/delete/',
            method: 'POST',
            beforeSend: function(xhr) {
                var csrftoken = getCookie('csrftoken');
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            },
            success: function(response) {
                console.log('Alumno eliminado exitosamente:', response);
                var modalElement = document.getElementById('deleteAlumnoModal');
                var modalInstance = bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) {
                    modalInstance.hide();
                }
                Backbone.trigger('alumnos:reload');
            },
            error: function(xhr) {
                console.error('Error al eliminar alumno:', xhr.responseText);
                var errorMsg = '';
                try {
                    var response = JSON.parse(xhr.responseText);
                    errorMsg = response.error || 'Error al eliminar alumno';
                } catch (e) {
                    errorMsg = 'Error desconocido al eliminar alumno';
                }
                $('#delete-error-message').removeClass('d-none').text(errorMsg);
            }
        });
    }
};

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