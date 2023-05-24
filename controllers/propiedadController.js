import { validationResult } from 'express-validator'
import { Categorias, Precio, Propiedad } from '../model/index.js'

const admin =  (req, res) => {
    res.render('propiedades/admin', {
        pagina: 'Mis Propiedades'
    })
}

const crear = async (req,res) => {
    const [categorias, precios] = await Promise.all([
        Categorias.findAll(),
        Precio.findAll()
    ])

    res.render('propiedades/crear', {
        pagina: 'Crear Propiedad',
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: {}
    })
}

const guardar = async (req, res) => {
    let resultado = validationResult(req)
    if(!resultado.isEmpty()) {

        const [categorias, precios] = await Promise.all([
            Categorias.findAll(),
            Precio.findAll()
        ])

        return res.render('propiedades/crear', {
            pagina: 'Crear Propiedad',
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
        })
    }

    const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio:precioId, categorias:categoriasId } = req.body

    const {id: usuarioId} = req.usuario

    try{    
       const propiedadGuardada = await Propiedad.create({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng, 
            precioId,
            categoriasId,
            usuarioId,
            imagen: ''
       }) 

       const { id } = propiedadGuardada

       res.redirect(`/propiedades/agregar-imagen/${id}`)

    } catch (error) {

    }

}

const agregarImagen = async (req, res) => {
    res.render('/propiedades/agregar-imagen', {
        pagina: 'Agregar Imagen'
    })
}

export  {
    admin,
    crear,
    guardar,
    agregarImagen
}