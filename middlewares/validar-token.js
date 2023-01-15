const { request, response } = require('express');
const JWT = require('jsonwebtoken');

const validateJwt = ( req = request, res = response, next ) => {

    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la peticion'
        });
    }

    try {
        
        const payload = JWT.verify(
            token,
            process.env.SECRET_JWT_SEED
        );

        req.uid = payload.uid,
        req.name = payload.name

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        })
    }

    next();

}


module.exports = {
    validateJwt
}