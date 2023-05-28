import bcrypt from 'bcrypt'

const usuarios = [
    {
        nombre: 'Martin',
        email: 'martin@martin.com',
        confirmado: 1,
        password: bcrypt.hashSync('123456', 10)
    }
]

export default usuarios