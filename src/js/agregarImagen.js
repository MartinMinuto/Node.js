import { Dropzone } from 'dropzone'

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

Dropzone.options.imagen = {
    dictDefaultMessage: 'Subir Imagen',
    acceptedFiles: '.png, .jpg, .jpeg',
    maxFilesize: 5,
    maxFiles: 1,
    parallelUploads: 1,
    autoProcessQueue: false,
    addRemoveLinks: true,
    dictRemoveFile: 'Eliminar',
    dictMaxFilesExceeded: 'El limite es 1 imagen',
    headers: {
        'CSRF-Token': token
    },
    paramName: 'imagen'
}