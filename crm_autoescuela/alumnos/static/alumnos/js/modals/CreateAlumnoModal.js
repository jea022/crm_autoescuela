var CreateAlumnoModal = {
    init: function() {
        console.log('CreateAlumnoModal inicializado');
        Backbone.on('alumno:create', this.showModal, this);
        
        $('#save-new-alumno').off('click').on('click', this.handleCreate);
        
        $('#createAlumnoModal').on('hidden.bs.modal', function () {
            $('#create-alumno-form')[0].reset();
            $('#create-error-message').addClass('d-none').text('');
            
            $('.modal-backdrop').remove();
            $('body').removeClass('modal-open').css('padding-right', '');
        });

        $('#create-alumno').click(function() {
            $('#createAlumnoModal').modal('show');
            loadProfesoresForCreate();
        });
    },

    showModal: function() {
        console.log('Mostrando modal de creación');
        $('#create-alumno-form')[0].reset();
        $('#create-error-message').addClass('d-none').text('');
        
        $('#createAlumnoModal').modal('show');
        loadProfesoresForCreate();
    },

    handleCreate: function() {
        console.log('Procesando formulario de creación');
        
        var formData = {
            nombre: $('#create-nombre').val(),
            apellido1: $('#create-apellido1').val(),
            apellido2: $('#create-apellido2').val(),
            email: $('#create-email').val(),
            direccionPostal: $('#create-direccion').val(),
            telefono: $('#create-telefono').val(),
            profesor: $('#create-profesor').val() || null 
        };
        
        const profesorId = $('#create-profesor').val();
        const profesorIdValue = profesorId && profesorId !== '' ? parseInt(profesorId) : null;
        
        console.log('Enviando datos del nuevo alumno con profesor:', profesorIdValue);
        
        const alumnoData = {
            nombre: formData.nombre,
            apellido1: formData.apellido1,
            apellido2: formData.apellido2 || null,
            email: formData.email,
            direccionPostal: formData.direccionPostal || null,
            telefono: formData.telefono || null,
            profesor: profesorIdValue
        };
        
        console.log('Datos a enviar:', JSON.stringify(alumnoData));
        
        $.ajax({
            url: '/alumnos/create/',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(alumnoData),
            beforeSend: function(xhr) {
                xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
            },
            success: function(response) {
                console.log('Alumno creado exitosamente:', response);
                
                $('#createAlumnoModal').modal('hide');
                
                setTimeout(function() {
                    Backbone.trigger('alumnos:reload');
                    
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open').css('padding-right', '');
                }, 300);
            },
            error: function(xhr) {
                console.error('Error al crear alumno:', xhr.responseText);
                var errorMsg = '';
                try {
                    var response = JSON.parse(xhr.responseText);
                    errorMsg = response.error || 'Error al crear alumno';
                } catch (e) {
                    errorMsg = 'Error desconocido al crear alumno';
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

function loadProfesoresForCreate() {
    console.log('Cargando profesores para el modal de creación...');
    
    fetch('/profesores/api/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar profesores: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log('Profesores cargados:', data);
            
            const select = document.getElementById('create-profesor');
            
            while (select.options.length > 1) {
                select.remove(1);
            }
            
            data.forEach(profesor => {
                const option = document.createElement('option');
                option.value = profesor.id;
                option.textContent = `${profesor.nombre} ${profesor.apellido1}`;
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error cargando profesores:', error);
        });
}
