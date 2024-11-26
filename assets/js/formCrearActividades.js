const crear = document.getElementById('formButtonAzulEnviar');
const editar = document.getElementById('formButtonAzulEditar');
const inhabilitar = document.getElementById('formButtonRojoInhabilitar');
const imagen = document.getElementById('imagenActividad');
const imagenGrupo = document.getElementById('imagenGrupo');

if(crear){
    crear.addEventListener('click', function () {
        Swal.fire({
            template: '#crear',
        }).then((result) => {
            if (result.isConfirmed) {
                // Enviar el formulario si se confirma
                document.getElementById('form').submit();
            }
        });
    });
}

if(editar){
    editar.addEventListener('click', function () {
        Swal.fire({
            template: '#editar',
        }).then((result) => {
            if (result.isConfirmed) {
                // Enviar el formulario si se confirma
                document.getElementById('form').submit();
            }
        });
    });
}

if(inhabilitar){
    inhabilitar.addEventListener('click', function () {
        Swal.fire({
            template: '#inhabilitar',
        }).then((result) => {
            if (result.isConfirmed) {
                // Enviar el formulario si se confirma
                document.getElementById('form').submit();
            }
        });
    });
}

if(imagen){
    imagen.addEventListener('change', function (event) {
        const file = event.target.files[0]; // Obtiene el archivo seleccionado
        const preview = document.getElementById('preview'); // Contenedor para la vista previa
        const label = document.getElementById('customUploadText'); // Label para mostrar el nombre del archivo

        if (file) {
            const reader = new FileReader(); // Crea un FileReader para leer el archivo
            
            // Evento que se ejecuta cuando la imagen se carga en memoria
            reader.onload = function (e) {
                preview.style.backgroundImage = `url('${e.target.result}')`; // Aplica la imagen como fondo
            };
            
            reader.readAsDataURL(file); // Lee el archivo como una URL de datos

            // Actualiza el texto del label con el nombre del archivo
            label.querySelector('p').textContent = file.name;
        } else {
            // Si no hay archivo, elimina cualquier imagen previa y restablece el texto del label
            preview.style.backgroundImage = 'none';
            label.querySelector('p').textContent = 'Elegir imagen';
        }
    });
}

if(imagenGrupo){
    imagenGrupo.addEventListener('change', function (event) {
        const file = event.target.files[0]; // Obtiene el archivo seleccionado
        const preview = document.getElementById('preview'); // Contenedor para la vista previa
        const label = document.getElementById('customUploadText'); // Label para mostrar el nombre del archivo

        if (file) {
            const reader = new FileReader(); // Crea un FileReader para leer el archivo
            
            // Evento que se ejecuta cuando la imagen se carga en memoria
            reader.onload = function (e) {
                preview.style.backgroundImage = `url('${e.target.result}')`; // Aplica la imagen como fondo
            };
            
            reader.readAsDataURL(file); // Lee el archivo como una URL de datos

            // Actualiza el texto del label con el nombre del archivo
            label.querySelector('p').textContent = file.name;
        } else {
            // Si no hay archivo, elimina cualquier imagen previa y restablece el texto del label
            preview.style.backgroundImage = 'none';
            label.querySelector('p').textContent = 'Elegir imagen';
        }
    });
}