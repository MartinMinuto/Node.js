import { check, validationResult } from 'express-validator'
import Usuario from '../model/Usuario.js'

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesion'
    })
}

const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: 'Crear Cuenta'
    })
}

const registrar = async (req, res) => {
   await check('nombre').notEmpty().withMessage('Este campo no puede ir vacio!').run(req)
   await check('email').isEmail().withMessage('Este campo no puede ir vacio!').run(req)
   await check('password').isLength({min: 6}).withMessage('La contraseña debe tener 6 caracteres como minimo').run(req)
   await check('repetir_password').equals('password').withMessage('La contraseña no es la misma').run(req)
   let resultado = validationResult(req)

   if(!resultado.isEmpty()){
      return res.render('auth/registro', {
        pagina: 'Crear Cuenta',
        errores: resultado.array()
      })
   }

   const usuario = await Usuario.create(req.body)
   res.json(usuario)
}

const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password', {
        pagina: 'Recupera tu acceso a BienesRaices'
    })
}

export {
    formularioLogin,
    formularioRegistro,
    registrar,
    formularioOlvidePassword
}