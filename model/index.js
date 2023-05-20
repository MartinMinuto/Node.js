import Propiedad from './Propiedad.js'
import Precio from './Precio.js'
import Categorias from './Categorias.js'
import Usuario from './Usuario.js'

Propiedad.belongsTo(Precio, {foreignKey: 'precioId'})
Propiedad.belongsTo(Categorias, {foreignKey: 'categoriasId'})
Propiedad.belongsTo(Usuario, {foreignKey: 'usuarioId'})

export {
    Propiedad,
    Precio,
    Categorias,
    Usuario
}