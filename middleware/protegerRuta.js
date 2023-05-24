import jwt from 'jsonwebtoken'
import {Usuario} from '../model/index.js'

const protegerRuta = async (req, res, next) => {

    const { _token } = req.cookies
    if(!_token){
        return res.redirect('/auth/login')
    }

    try{

        const decoded = jwt.verify(_token, process.env.JWT_SECRET)
        const usuario = await Usuario.findByPK(decoded.id)

    } catch (error) {
        return res.clearCookie('_token').redirect('/auth/login')
    }

    next()
}

export default protegerRuta