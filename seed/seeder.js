import catergorias from "./categorias.js";
import precios from "./precios.js";
import Categorias from '../model/Categorias.js'
import Precio from '../model/Precio.js'
import db from '../config/db.js'

const importarDatos = async () => {
    try{
       await db.authenticate()
       await db.sync()

       await Promise.all([
            Categorias.bulkCreate(catergorias),
            Precio.bulkCreate(precios)
       ])

       console.log('Datos importados')
       process.exit()
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

const eliminarDatos = async () => {
    try{
        await Promise.all([
            Categorias.destroy({where: {}, truncate:true}),
            Precio.destroy({where: {}, truncate:true})
       ])
       console.log('Datos eliminados')
       process.exit()
    } catch (error) {
        console.log(error)
        process.exit(1) 
    }
}

if(process.argv[2] === "-i"){
    importarDatos();
}

if(process.argv[2] === "-e"){
    eliminarDatos();
}