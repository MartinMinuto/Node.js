import Propiedad from './Propiedad.js'
import Precio from './Precio.js'
import Categorias from './Categorias.js'
import Usuario from './Usuario.js'

Precio.hasOne(Propiedad)

export {
    Propiedad,
    Precio,
    Categorias,
    Usuario
}