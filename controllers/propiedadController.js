import { unlink } from 'node:fs/promises'
import { validationResult } from 'express-validator'
import { Categorias, Precio, Propiedad } from '../model/index.js'

const admin = async (req, res) => {

    const { pagina: paginaActual } = req.query
    const expresion = /[0-9]/
    if(!expresion.test(paginaActual)) {
        return res.redirect('/mis-propiedades?pagina=1')
    }

    const { id } = req.usuario

    const propiedades = await Propiedad.findAll({
        where: {
            usuarioId : id
        },
        include: [
            {
                model: Categorias, as: 'categoria'
            },
            {
                model: Precio, as: 'precio'
            }
        ]
    })

    res.render('propiedades/admin', {
        pagina: 'Mis Propiedades',
        csrfToken: req.csrfToken(),
        propiedades,
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

    const { id } = req.params

    const propiedad = await Propiedad.findByPk(id)
    if(!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    if(propiedad.publicado){
        return res.redirect('/mis-propiedades')
    }

    if( req.usuario.id.toString() !== propiedad.usuarioId.toString()){
        return res.redirect('/mis-propiedades')
    }


    res.render('/propiedades/agregar-imagen', {
        pagina: `Agregar Imagen: ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        propiedad
    })
}

const almacenarImagen = async (req,res, next) => {

    const { id } = req.params

    const propiedad = await Propiedad.findByPk(id)
    if(!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    if(propiedad.publicado){
        return res.redirect('/mis-propiedades')
    }

    if( req.usuario.id.toString() !== propiedad.usuarioId.toString()){
        return res.redirect('/mis-propiedades')
    }

    try{
        
        console.log(req.file)

        propiedad.imagen = req.file.filename
        propiedad.publicado = 1

        await propiedad.save()

        next()

    } catch(error) {
        console.log(error)
    }

}

const editar = async (req, res) => {

    const { id } = req.params

    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }

    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect('/mis-propiedades')
    }

    const [categorias, precios] = await Promise.all([
        Categorias.findAll(),
        Precio.findAll()
    ])

    res.render('propiedades/editar', {
        pagina: `Editar ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: propiedad
    })
}

const guardarCambios = async (req, res) => {

    let resultado = validationResult(req)
    if(!resultado.isEmpty()) {

        const [categorias, precios] = await Promise.all([
            Categorias.findAll(),
            Precio.findAll()
        ])

        return res.render('propiedades/editar', {
            pagina: 'Editar Propiedad',
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
        })
    }

    const { id } = req.params

    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }

    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect('/mis-propiedades')
    }

    try {
        const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio:precioId, categorias:categoriasId } = req.body
    
        propiedad.set({
           titulo,
           descripcion,
           habitaciones,
           estacionamiento,
           wc,
           calle,
           lat,
           lng,
           precioId,
           categoriasId 
        })

        await propiedad.save()

        res.redirect('/mis-propiedades')

    } catch(error) {
        console.log(error)
    }

} 

const eliminar = async (req, res) => {
     
    const { id } = req.params

    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }

    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect('/mis-propiedades')
    }

    await unlink(`public/uploads/${propiedad.imagen}`)
    console.log(`Se elimino la imagen ${propiedad.imagen}`)

    await propiedad.destroy()
    res.redirect('/mis-propiedades')
}

const mostrarPropiedad = async (req,res) => {

    const {id} = req.params

    const propiedad = await Propiedad.findByPk(id, {
        include: [
            {model: Precio, as:'precio'},
            {model: Categorias, as: 'categoria'},
        ]
    })

    if(!propiedad){
        return res.redirect('/404')
    }
    res.render('propiedades/mostrar', {
        propiedad,
        pagina: propiedad.titulo
    })

}

export  {
    admin,
    crear,
    guardar,
    agregarImagen,
    almacenarImagen,
    editar,
    guardarCambios,
    eliminar,
    mostrarPropiedad
}