const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generarJwt } = require('../helpers/jwt');

const createUser = async( req =  request, res = response ) => {

    const { email, password } = req.body;

   try {
    
    let user = await User.findOne({ email });

    if( user ){
      return res.status(400).json({
        ok: false,
        msg: 'El correo ya se encuentra registrado'
      });
    }

    user = new User( req.body );

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    await user.save();

    const token = await generarJwt(user._id, user.name );

    res.status(201).json({
      ok: true,
      msg: 'Registro',
      token,
      name: user.name,
      uid: user._id
    });

   } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "No se pudo realizar la creacion del usuario"
    })
   }

    
  
}

const loginUser = async( req = request, res = response ) => {

    const { email, password } = req.body;

    try {

      const user = await User.findOne({ email });

      if( !user ){
        return res.status(400).json({
          ok: false,
          msg: 'Email o contraseña incorrecta - email'
        });
      }

      // Confirmacion de la contraseña
      const validarPassword = bcrypt.compareSync( password, user.password );

      if( !validarPassword ){
        return res.status(400).json({
          ok: false,
          msg: 'Email o contraseña incorrecta - password'
        });
      }

      // Generar nuestro JWT
      const token = await generarJwt(user._id, user.name );

      res.json({
        ok: true,
        uid: user._id,
        email: user.name,
        token
      });

      
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        msg: "No se pudo realizar la creacion del usuario"
      })
    }
  
}

const reNewToken = async( req = request, res = response ) => {

    const uid = req.uid;
    const name = req.name;


    const token = await generarJwt(uid, name);

    res.json({
      ok: true,
      name,
      uid,
      token
    });
  
}


module.exports = {
    createUser,
    loginUser,
    reNewToken,
}