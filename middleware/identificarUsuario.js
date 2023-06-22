import jwt from 'jsonwebtoken'
import Usuario from '../model/Usuario.js'

const indentificarUsuario = async (req,res, next) => {

    const token = req.cookies._token
    if(!token) {
        req.usuario = null
        return next()
    }

}