import { Propiedad, Precio, Categorias } from '../model/index.js'

const propiedades = async (req,res) => {

    const propiedades = await Propiedad.findAll({
        include: [
            {model: Precio, as: 'precio'},
            {model: Categorias, as: 'categoria'},
        ]
    })

    res.json(propiedades)
}

export {
    propiedades
}