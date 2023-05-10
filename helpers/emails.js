import nodemailer from 'nodemailer'

const emailRegistro = async (datos) => {
    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

    const {email, nombre, token} = datos
    
    await transport.sendMail({
        from: 'BienesRaices.com.ar',
        to: email,
        subject: 'Confirmar tu cuenta de BienesRaices',
        text: 'Gracias por crear una cuenta en BienesRaices!',
        html: `<p>Hola ${nombre}, Gracias por crear tu cuenta en BienesRaices.</p>
           <p>Tu cuenta ya esta disponible, porfavor confirmarla en el siguiente enlace 
           <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Confirmar Cuenta!</a></p>
        `
    })
}

export {
    emailRegistro
}