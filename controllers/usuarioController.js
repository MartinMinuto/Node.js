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
        errores: resultado.array(),
        usuario: {
            nombre: req.body.nombre,
            email: req.body.email,
        }
    })
   }

   const existeUsuario = await Usuario.findOne({where:{email: req.body.email}})
   if(existeUsuario) {
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            errores: [{msg: 'El usuario ya esta registrado'}],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email,
            }
        })
    }

   await Usuario.create({
        nombre,
        email,
        password,
        token: 123
   })
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