import jws from 'jsonwebtoken'

const generarJWT = id => jwt.sign({id}, "Secreto", { expiresIn: '1d'})

const generarId = () => Date.now().toString(32) + Math.random().toString(32).substring(2);

export {
    generarId,
    generarJWT
}