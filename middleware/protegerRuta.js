import jwt from 'jsonwebtoken'

const protegerRuta = async (req, res, next) => {

    const { _token } = req.cookies
    if(!_token){
        return res.redirect('/auth/login')
    }

    try{

    } catch (error) {
        return res.clearCookie('_token').redirect('/auth/login')
    }

    next()
}

export default protegerRuta