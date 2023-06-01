import express from 'express'
import { body } from 'express-validator'
import { admin, crear, guardar, agregarImagen, almacenarImagen, editar } from '../controllers/propiedadController.js'
import protegerRuta from '../middleware/protegerRuta.js'
import upload from '../middleware/subirImagen.js'

const router = express.Router()

router.get('/mis-propiedades', protegerRuta, admin)
router.get('/propiedades/crear', protegerRuta, crear)
router.post('/propiedades/crear', protegerRuta,
    body('titulo').notEmpty().withMessage('El Titulo del anuncio es obligatorio'),
    body('description').notEmpty().withMessage('La descripcion no puede ir vacia').isLength({max:200}).withMessage('La desciption es muy larga'),
    body('categoria').isNumeric().withMessage('Selecciona una Categoria'),
    body('precio').isNumeric().withMessage('Selecciona un rango de Precio'),
    body('habitaciones').isNumeric().withMessage('Selecciona la cantidad de Habitacion'),
    body('estacionamiento').isNumeric().withMessage('Selecciona la cantidad de Estacionamiento'),
    body('wc').isNumeric().withMessage('Selecciona la cantidad de baños'),
    body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa'),
    guardar
)

router.get('/propiedades/agregar-imagen/:id',
    protegerRuta,
    agregarImagen
) 

router.post('/propiedades/agregar-imagen/:id',
    protegerRuta,
    upload.single('imagen'),
    almacenarImagen
)

router.get('/propiedades/editar/:id',
    protegerRuta,
    editar
)

router.post('/propiedades/editar/:id', protegerRuta,
    body('titulo').notEmpty().withMessage('El Titulo del anuncio es obligatorio'),
    body('description').notEmpty().withMessage('La descripcion no puede ir vacia').isLength({max:200}).withMessage('La desciption es muy larga'),
    body('categoria').isNumeric().withMessage('Selecciona una Categoria'),
    body('precio').isNumeric().withMessage('Selecciona un rango de Precio'),
    body('habitaciones').isNumeric().withMessage('Selecciona la cantidad de Habitacion'),
    body('estacionamiento').isNumeric().withMessage('Selecciona la cantidad de Estacionamiento'),
    body('wc').isNumeric().withMessage('Selecciona la cantidad de baños'),
    body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa'),
    guardar
)


export default router