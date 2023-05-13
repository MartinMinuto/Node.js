import { check, validationResult } from 'express-validator'
import  jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import Usuario from '../model/Usuario.js'
import { generarId, generarJWT } from '../helpers/tokens.js'
import { emailRegistro, emailOlvidePassword } from '../helpers/emails.js'

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesion',
        csrfToken: req.csrfToken()
    })
}

const autenticar = async (req, res) => {
    await check('email').isEmail().withMessage('Este email es Obligatorio!').run(req)
    await check('password').notEmpty().withMessage('La contraseña es Obligatoria!').run(req)

    let resultado = validationResult(req)

    if(!resultado.isEmpty()){
       return res.render('auth/login', {
         pagina: 'Iniciar Sesion',
         csrfToken: req.csrfToken(),
         errores: resultado.array()
     })
    }

    const { email, password} = req.body

    const usuario = await Usuario.findOne({where:{email}})
    if(!usuario) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesion',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El usuario no existe!'}]
        })
    }

    if(!usuario.confirmado) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesion',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'Tu cuenta no ha sido confirmada!'}]
        })
    }

    if(!usuario.verificarPassword(password)) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesion',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'La contraseña es Incorrecta!'}]
        })
    }

    const token = generarJWT(usuario.id)

}

const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: 'Crear Cuenta',
        csrfToken: req.csrfToken()
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
        csrfToken: req.csrfToken(),
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
            csrfToken: req.csrfToken(),
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

const confirmar = async (req, res) => {
    const { token } = req.params;
    const usuario = await Usuario.findOne({ where:{token}})
    if(!usuario){
        return res.render('auth/confirmar-cuenta', {
            pagina:'Error al confirmar tu cuenta',
            mensaje: 'Hubo un error al confirmar tu cuenta, intenta de nuevo!',
            error: true
        })
    }

    usuario.token = null;
    usuario.confirmar = true;
    await usuario.save();

    res.render('auth/confirmar-cuenta', {
        pagina:'Cuenta Confirmada',
        mensaje: 'La cuenta se confirmo correctamente!'
    })
}

const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password', {
        pagina: 'Recupera tu acceso a BienesRaices',
        csrfToken: req.csrfToken()
    })
}

const resetPassword = async (req,res) => {
    await check('email').isEmail().withMessage('Este es un email?').run(req)
    let resultado = validationResult(req)
 
    if(!resultado.isEmpty()){
       return res.render('auth/olvide-password', {
        pagina: 'Recupera tu acceso a BienesRaices',
        csrfToken: req.csrfToken(),
        errores: resultado.array()
      })
    }

    const {email} = req.body
    const usuario = await Usuario.findOne({where:{email}})
    if(!usuario){
        return res.render('auth/olvide-password', {
         pagina: 'Recupera tu acceso a BienesRaices',
         csrfToken: req.csrfToken(),
         errores: [{msg:'El email no pertenece a ningun usuario'}]
      })
    }

    usuario.token = generarId();
    await usuario.save();

    emailOlvidePassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    })

    res.render('templates/mensaje', {
        pagina:'Restablecer tu contraseña',
        mensaje: 'Hemos enviado un Email con las instrucciones'
    })

}   

const comprobarToken = async (req,res) => {
   const {token} = req.params
   const usuario = await Usuario.findOne({where:{token}})
   if(!usuario){
    return res.render('auth/confirmar-cuenta', {
        pagina:'Restablece tu contraseña',
        mensaje: 'Hubo un error al validar tu informarcion, intenta de nuevo',
        error: true
      })
   }

   res.render('auth/reset-password',{
     pagina: 'Restablece tu password',
     csrfToken: req.csrfToken()
   })
}

const nuevoPassword = async (req,res) => {
    await check('password').isLength({min: 6}).withMessage('La contraseña debe tener 6 caracteres como minimo').run(req)

    let resultado = validationResult(req)

    if(!resultado.isEmpty()){
       return res.render('auth/reset-password', {
         pagina: 'Restablce tu Contraseña',
         csrfToken: req.csrfToken(),
         errores: resultado.array()
     })
    }

    const {token} = req.params
    const {password} = req.body

    const usuario = await Usuario.findOne({where:{token}})

    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash(password, salt);
    usuario.token = null;

    await usuario.save();

    res.render('auth/confirmar-cuenta', {
        pagina: 'Contraseña restablecido',
        mensaje: 'La contraseña de restablecio correctamente'
    })


}

export {
    formularioLogin,
    autenticar,
    formularioRegistro,
    registrar,
    confirmar,
    formularioOlvidePassword,
    resetPassword,
    comprobarToken,
    nuevoPassword
}