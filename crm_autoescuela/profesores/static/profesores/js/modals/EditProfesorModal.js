var EditProfesorModal = {
    init: function() {
        console.log('EditProfesorModal inicializado');
        Backbone.on('profesor:edit', this.showModal, this);
        
        $('#save-edit-profesor').off('click').on('click', this.handleEdit);
        
        $('#editProfesorModal').on('hidden.bs.modal', function () {
            document.querySelector('#focus-trap').focus();
        });
    },

    showModal: function(profesorData) {
        console.log('Mostrando modal de edición');
        $('#edit-id').val(profesorData.id);
        $('#edit-nombre').val(profesorData.nombre);
        $('#edit-apellido1').val(profesorData.apellido1);
        $('#edit-apellido2').val(profesorData.apellido2);
        $('#edit-email').val(profesorData.email);
        $('#edit-direccion').val(profesorData.direccionPostal);
        $('#edit-telefono').val(profesorData.telefono);
        $('#edit-error-message').addClass('d-none').text('');
        
        var modal = new bootstrap.Modal(document.getElementById('editProfesorModal'));
        modal.show();
    },

    handleEdit: function() {
        console.log('Procesando formulario de edición');
        
        var formData = {
            id: $('#edit-id').val(),
            nombre: $('#edit-nombre').val(),
            apellido1: $('#edit-apellido1').val(),
            apellido2: $('#edit-apellido2').val(),
            email: $('#edit-email').val(),
            direccionPostal: $('#edit-direccion').val(),
            telefono: $('#edit-telefono').val()
        };
        
        console.log('Datos a enviar:', JSON.stringify(formData));
        
        $.ajax({
            url: '/profesores/' + formData.id + '/edit/',  
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            beforeSend: function(xhr) {
                var csrftoken = getCookie('csrftoken');
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            },
            success: function(response) {
                console.log('Profesor editado exitosamente:', response);
                
                document.activeElement.blur();
                var modalElement = document.getElementById('editProfesorModal');
                var modalInstance = bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) {
                    modalInstance.hide();
                }
                
                Backbone.trigger('profesores:reload');
            },
            error: function(xhr) {
                console.error('Error al editar profesor:', xhr.responseText);
                var errorMsg = '';
                try {
                    var response = JSON.parse(xhr.responseText);
                    errorMsg = response.error || 'Error al editar profesor';
                } catch (e) {
                    errorMsg = 'Error desconocido al editar profesor';
                }
                $('#edit-error-message').removeClass('d-none').text(errorMsg);
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