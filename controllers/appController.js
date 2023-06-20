import { Precio, Categorias, Propiedad } from '../model/index.js'

const inicio = async (req,res) => {

    const [categorias, precios, casas, departamentos ] = await Promise.all([
        Categorias.findAll({raw: true}),
        Precio.findAll({raw: true}),
        Propiedad.findAll({
            limit:3,
            where: {
                categoriaId: 1 
            },
            include:[
                {
                    model: Precio,
                    as: 'precio'
                }
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        }),
        Propiedad.findAll({
            limit:3,
            where: {
                categoriaId: 2
            },
            include:[
                {
                    model: Precio,
                    as: 'precio'
                }
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        })
    ])

    res.render('inicio', {
        pagina: 'Inicio',
        categorias,
        precios,
        casas,
        departamentos
    })
}

const categoria = async (req,res) => {
    const { id } = req.params

    const categoria = await Categorias.findByPk(id)
    if(!categoria) {
        return res.redirec('/404')
    }

    const propiedades = await Propiedad.findaAll({
        where: {
            categoriaId: id
        },
        include: [
            {model: Precio, as: 'precio'}
        ]
    })

    res.render('categoria', {
        pagina: 'Categoria',
        propiedades
    })
}

const noEncontrado = (req,res) => {

}

const buscador = (req,res) => {
    
}

export {
    inicio,
    categoria,
    noEncontrado,
    buscador
}