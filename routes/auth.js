/* 
  Rutas de usuarios / auth
  host + /api/auth
*/
const express = require('express');
const { check } = require('express-validator');
const router = express.Router();

const { createUser, loginUser, reNewToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validateJwt } = require('../middlewares/validar-token');


router.post(
  '/new',
  [
    check('name', 'El nombre es obligatorio').not().isEmpty().isLength({ min: 6 }),
    check('email', 'El correo no es valido').isEmail(),
    check('password', 'El password es obligatorio y debe de tener minimo 6 caracteres').not().isEmpty().isLength({ min: 6 }),
    validarCampos
  ],
  createUser
);

router.post(
  '/',
  [
    check('email', 'El correo no es valido').isEmail(),
    check('password', 'El password es obligatorio y debe de tener minimo 6 caracteres').not().isEmpty().isLength({ min: 6 }),
    validarCampos
  ],
  loginUser );

router.get('/renew', 
  validateJwt,
  reNewToken 
);



module.exports = router;