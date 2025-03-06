var CreateProfesorModal = {
    init: function() {
        console.log('CreateProfesorModal inicializado');
        Backbone.on('profesor:create', this.showModal, this);
        
        $('#save-new-profesor').off('click').on('click', this.handleCreate);
        
        $('#createProfesorModal').on('hidden.bs.modal', function () {
            document.querySelector('#focus-trap').focus();
        });
    },

    showModal: function() {
        console.log('Mostrando modal de creación');
        $('#create-profesor-form')[0].reset();
        $('#create-error-message').addClass('d-none').text('');
        
        var modal = new bootstrap.Modal(document.getElementById('createProfesorModal'));
        modal.show();
    },

    handleCreate: function() {
        console.log('Procesando formulario de creación');
        
        var formData = {
            nombre: $('#create-nombre').val(),
            apellido1: $('#create-apellido1').val(),
            apellido2: $('#create-apellido2').val(),
            email: $('#create-email').val(),
            direccionPostal: $('#create-direccion').val(),
            telefono: $('#create-telefono').val()
        };
        
        console.log('Datos a enviar:', JSON.stringify(formData));
        
        $.ajax({
            url: '/profesores/create/',  
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            beforeSend: function(xhr) {
                var csrftoken = getCookie('csrftoken');
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            },
            success: function(response) {
                console.log('Profesor creado exitosamente:', response);
                
                document.activeElement.blur();
                var modalElement = document.getElementById('createProfesorModal');
                var modalInstance = bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) {
                    modalInstance.hide();
                }
                
                Backbone.trigger('profesores:reload');
            },
            error: function(xhr) {
                console.error('Error al crear profesor:', xhr.responseText);
                var errorMsg = '';
                try {
                    var response = JSON.parse(xhr.responseText);
                    errorMsg = response.error || 'Error al crear profesor';
                } catch (e) {
                    errorMsg = 'Error desconocido al crear profesor';
                }
                $('#create-error-message').removeClass('d-none').text(errorMsg);
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