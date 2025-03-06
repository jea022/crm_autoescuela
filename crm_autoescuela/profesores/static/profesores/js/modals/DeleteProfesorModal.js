var DeleteProfesorModal = {
    init: function() {
        console.log('DeleteProfesorModal inicializado');
        Backbone.on('profesor:delete', this.showModal, this);
        $('#confirm-delete-profesor').off('click').on('click', this.handleDelete);
        $('#deleteProfesorModal').on('hidden.bs.modal', function () {
            document.querySelector('#focus-trap').focus();
        });
    },

    showModal: function(profesorData) {
        console.log('Mostrando modal de eliminación');
        $('#delete-id').val(profesorData.id);
        $('#delete-error-message').addClass('d-none').text('');
        var modal = new bootstrap.Modal(document.getElementById('deleteProfesorModal'));
        modal.show();
    },

    handleDelete: function() {
        console.log('Procesando eliminación de profesor');
        var profesorId = $('#delete-id').val();
        console.log('ID del profesor a eliminar:', profesorId);

        $.ajax({
            url: '/profesores/' + profesorId + '/delete/',
            method: 'POST',
            beforeSend: function(xhr) {
                var csrftoken = getCookie('csrftoken');
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            },
            success: function(response) {
                console.log('Profesor eliminado exitosamente:', response);
                var modalElement = document.getElementById('deleteProfesorModal');
                var modalInstance = bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) {
                    modalInstance.hide();
                }
                Backbone.trigger('profesores:reload');
            },
            error: function(xhr) {
                console.error('Error al eliminar profesor:', xhr.responseText);
                var errorMsg = '';
                try {
                    var response = JSON.parse(xhr.responseText);
                    errorMsg = response.error || 'Error al eliminar profesor';
                } catch (e) {
                    errorMsg = 'Error desconocido al eliminar profesor';
                }
                $('#delete-error-message').removeClass('d-none').text(errorMsg);
            }
        });
    }
};

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