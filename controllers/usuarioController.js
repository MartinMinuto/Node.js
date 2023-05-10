import { check, validationResult } from 'express-validator'
import Usuario from '../model/Usuario.js'
import { generarId } from '../helpers/tokens.js'
import { emailRegistro } from '../helpers/emails.js'

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

   const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId()
   })

   emailRegistro({
    nombre: usuario.nombre,
    email: usuario.email,
    token: usuario.token
   })

   res.render('templates/mensaje', {
       pagina:'Cuenta creada correctamente',
       mensaje: 'Hemos enviado un Email de confirmacion, presiona en el enlace para confirmar tu cuenta'
   })

}   

const confirmar = (req, res, next) => {
    const { token } = req.params;

    next()
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
    confirmar,
    formularioOlvidePassword
}