/* 
|   Rutas de Eventos / auth
    host + /api/events
*/

const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

const { getEventos, createdEvent, updateEvent, deleteEvent } = require('../controllers/events');
const { validateJwt } = require('../middlewares/validar-token');
const { validarCampos } = require('../middlewares/validar-campos');
const { isDate } = require('../helpers/isDate');

router.use( validateJwt );

//Obtener eventos

router.get('/', getEventos);

router.post(
    '/', 
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom(isDate),
        check('end', 'Fecha de finalizacion es obligatoria').custom(isDate),
        validarCampos
    ], 
    createdEvent
);

router.put(
    '/:id',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom(isDate),
        check('end', 'Fecha de finalizacion es obligatoria').custom(isDate),
        validarCampos
    ],
    updateEvent
);

router.delete('/:id', deleteEvent);

module.exports = router;