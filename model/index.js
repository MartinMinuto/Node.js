import Propiedad from './Propiedad.js'
import Precio from './Precio.js'
import Categorias from './Categorias.js'
import Usuario from './Usuario.js'
import Mensaje from './Mensaje.js'

Propiedad.belongsTo(Precio, { foreignKey: 'precioId'})
Propiedad.belongsTo(Categorias, { foreignKey: 'categoriasId'})
Propiedad.belongsTo(Usuario, { foreignKey: 'usuarioId'})
Propiedad.hasMany(Mensaje, { foreignKey: 'propiedadId'})

Mensaje.belongsTo(Propiedad, { foreignKey: 'propiedadId'})
Mensaje.belongsTo(Usuario, { foreignKey: 'usuarioId'})

export {
    Propiedad,
    Precio,
    Categorias,
    Usuario,
    Mensaje
}