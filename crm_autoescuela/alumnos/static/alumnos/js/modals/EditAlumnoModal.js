function loadProfesoresForEdit(selectedProfesorId) {
    console.log('Cargando profesores para el modal de edición...');
    
    fetch('/profesores/api/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar profesores: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log('Profesores cargados:', data);
            
            const select = document.getElementById('edit-profesor');
            
            while (select.options.length > 1) {
                select.remove(1);
            }
            
            data.forEach(profesor => {
                const option = document.createElement('option');
                option.value = profesor.id;
                option.textContent = `${profesor.nombre} ${profesor.apellido1}`;
                select.appendChild(option);
            });
            
            if (selectedProfesorId) {
                select.value = selectedProfesorId;
            }
        })
        .catch(error => {
            console.error('Error cargando profesores:', error);
        });
}

var EditAlumnoModal = {
    currentAlumnoId: null,
    
    init: function() {
        console.log('Inicializando EditAlumnoModal');
        
        Backbone.on('alumno:edit', function(data) {
            EditAlumnoModal.currentAlumnoId = data.id;
            
            $('#edit-id').val(data.id);
            $('#edit-nombre').val(data.nombre);
            $('#edit-apellido1').val(data.apellido1);
            $('#edit-apellido2').val(data.apellido2 || '');
            $('#edit-email').val(data.email);
            $('#edit-direccionPostal').val(data.direccionPostal || '');
            $('#edit-telefono').val(data.telefono || '');
            
            const profesorId = data.profesor ? data.profesor.id : null;
            loadProfesoresForEdit(profesorId);
            
            $('#editAlumnoModal').modal('show');
        });
        
        $('#save-edit-alumno').click(function() {
            const alumnoId = EditAlumnoModal.currentAlumnoId;
            const nombre = $('#edit-nombre').val();
            const apellido1 = $('#edit-apellido1').val();
            const apellido2 = $('#edit-apellido2').val();
            const email = $('#edit-email').val();
            const direccionPostal = $('#edit-direccionPostal').val();
            const telefono = $('#edit-telefono').val();
            const profesorId = $('#edit-profesor').val(); 
            
            if (!nombre || !apellido1 || !email) {
                $('#edit-error-message').removeClass('d-none').text('Los campos Nombre, Primer Apellido y Email son obligatorios.');
                return;
            }
            
            const profesorIdValue = profesorId && profesorId !== '' ? parseInt(profesorId) : null;
            
            console.log('Enviando datos de alumno con profesor:', profesorIdValue);
            
            const alumnoData = {
                nombre: nombre,
                apellido1: apellido1,
                apellido2: apellido2 || null,
                email: email,
                direccionPostal: direccionPostal || null,
                telefono: telefono || null,
                profesor: profesorIdValue 
            };
            
            $.ajax({
                url: '/alumnos/' + alumnoId + '/edit/', 
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(alumnoData),
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
                    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                },
                success: function(response) {
                    console.log('Alumno actualizado exitosamente:', response);
                    
                    if (profesorIdValue !== null) {
                        if (!response.profesor) {
                            console.error('Error: El profesor no se guardó correctamente. La respuesta no contiene profesor.');
                        } else if (response.profesor.id !== profesorIdValue) {
                            console.error('Error: El ID del profesor guardado no coincide con el enviado.', {
                                enviado: profesorIdValue,
                                recibido: response.profesor.id
                            });
                        } else {
                            console.log('Profesor guardado correctamente:', response.profesor);
                        }
                    } else if (response.profesor !== null) {
                        console.warn('Advertencia: Se envió null como profesor pero se recibió un profesor en la respuesta:', response.profesor);
                    }
                    
                    Backbone.trigger('alumnos:reload');
                                        
                    $('#editAlumnoModal').modal('hide');
                    
                    setTimeout(function() {
                        $('.modal-backdrop').remove();
                        $('body').removeClass('modal-open').css('padding-right', '');
                    }, 300);
                },
                error: function(xhr) {
                    console.error('Error al actualizar alumno:', xhr.responseText);
                    var errorMsg = 'Error al actualizar alumno';
                    try {
                        if (xhr.responseText) {
                            var response = JSON.parse(xhr.responseText);
                            errorMsg = response.error || errorMsg;
                        }
                    } catch (e) {}
                    $('#edit-error-message').removeClass('d-none').text(errorMsg);
                }
            });
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