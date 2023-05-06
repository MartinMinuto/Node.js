const formularioLogin = (req, res => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesion'
    })
})

const formularioRegistro = (req, res => {
    res.render('auth/registro', {
        pagina: 'Crear Cuenta'
    })
})

const registrar = (req, res => {
})

const formularioOlvidePassword = (req, res => {
    res.render('auth/olvide-password', {
        pagina: 'Recupera tu acceso a BienesRaices'
    })
})

export {
    formularioLogin,
    formularioRegistro,
    registrar,
    formularioOlvidePassword
}