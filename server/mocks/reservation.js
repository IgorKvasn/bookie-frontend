/*jshint node:true*/
module.exports = function(app) {
    var express = require('express');
    var reservationRouter = express.Router();

    reservationRouter.get('/', function(req, res) {
        res.send({
            'reservation': []
        });
    });

    reservationRouter.post('/', function(req, res) {
        var body = req.body;
        body.reservation.id = Date.now() + '';
        res.send(body).status(201).end();
    });

    reservationRouter.get('/:id', function(req, res) {
        res.send({
            'reservation': {
                id: req.params.id
            }
        });
    });

    reservationRouter.put('/:id', function(req, res) {
        res.send({
            'reservation': {
                id: req.params.id
            }
        });
    });

    reservationRouter.delete('/:id', function(req, res) {
        res.status(204).end();
    });

    // The POST and PUT call will not contain a request body
    // because the body-parser is not included by default.
    // To use req.body, run:

    //    npm install --save-dev body-parser

    // After installing, you need to `use` the body-parser for
    // this mock uncommenting the following line:
    //
    app.use('/api/reservation', require('body-parser').json());
    app.use('/api/reservation', reservationRouter);
};
