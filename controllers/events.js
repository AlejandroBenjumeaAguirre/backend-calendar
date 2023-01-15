const { request, response } = require('express');
const Event = require('../models/events');

const getEventos = async(req = request, res = response, next) => {

    try {

        const events = await Event.find()
                                    .populate('user', 'name email');

        res.status(200).json({
            ok: true,
            events
        });

    } catch (error) {
        console.log(error);
        res.status(401).json({
            ok: false,
            msg: 'No se pudo obtener los eventos hable con el administrador'
        })
    }

}

const createdEvent = async( req = request, res = response, next ) => {

    const event = new Event( req.body );

    try {

        event.user = req.uid;

        const eventSave = await event.save();

        res.status(200).json({
            ok: true,
            eventSave,
            msg: 'Se realizo la creacion del evento'
        })
        
    } catch (error) {
        console.log(error);
        res.status(401).json({
            ok: false,
            msg: 'No se pudo crear el evento hable con el administrador'
        });
    }

}

const updateEvent = async( req = request, res = response, next ) => {

    const eventId = req.params.id;
    const userId = req.uid;

    try {

        const events = await Event.findById(eventId);

        if(!events) {
            return res.status(404).json({
                ok: false,
                msg: 'Id del evento no existe'
            });
        }
        if( events.user.toString() !== userId ){
            return res.status(401).json({
                ok: false,
                msg: "No tienes permisos para actualizar el evento"
            });
        }

        const newEvent = {
            ...req.body,
            user: userId
        }

        const eventUpdate = await Event.findByIdAndUpdate( eventId, newEvent, { new: true } );

        res.status(200).json({
            ok: true,
            eventUpdate,
            msg: 'Evento actualizado satisfactoriamente'
        });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });

    }


}

const deleteEvent = async( req = request, res = response, next) => {

    const eventId = req.params.id;
    const userId = req.uid;

    try {
        
        const events = await Event.findById(eventId);

        if(!events) {
            return res.status(404).json({
                ok: false,
                msg: 'Id del evento no existe'
            });
        }

        if( events.user.toString() !== userId ){
            return res.status(401).json({
                ok: false,
                msg: "No tienes permisos para actualizar el evento"
            });
        }

        const eventDelete = await Event.findByIdAndDelete(eventId);

        res.status(200).json({
            ok: true,
            eventDelete,
            msg: 'Evento eliminado correctamente'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}


module.exports = {
    getEventos,
    createdEvent,
    updateEvent,
    deleteEvent
}