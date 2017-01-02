/*jshint node:true*/
var moment = require('moment');

module.exports = function(app) {
  var express = require('express');
  var reservationRouter = express.Router();

  reservationRouter.get('/', function(req, res) {
    var day = moment(new Date(parseInt(req.query.day, 10)));
    setTimeout(function() {
      res.send({
        'reservation': [{
          id: '2',
          startTime: day.startOf('day').minutes(30).hours(9).unix() * 1000, //utorok, 12/20/2016, 9:30:00 AM
          endTime: day.startOf('day').minutes(30).hours(12).unix() * 1000, //12:30
          reservedFor: 'Jožko Jahoda',
          courtName: 'K2'
        }, {
          id: '3',
          startTime: day.startOf('day').minutes(0).hours(13).unix() * 1000, //utorok, 12/20/2016, 13:00:00 PM
          endTime: day.startOf('day').minutes(30).hours(14).unix() * 1000, //14:30
          reservedFor: 'Jožko Jahoda',
          courtName: 'K4'
        }, {
          id: '4',
          startTime: day.startOf('day').minutes(30).hours(14).unix() * 1000, //utorok, 12/20/2016, 14:30:00 PM
          endTime: day.startOf('day').minutes(30).hours(15).unix() * 1000, //15:30
          reservedFor: 'Jožko2 Jahoda2',
          courtName: 'K4'
        }]
      });
    }, 4000);

  });

  reservationRouter.post('/', function(req, res) {
    var body = req.body;
    body.reservation.id = Date.now() + '';
    setTimeout(function() {
      res.send(body).status(201).end();
    }, 3000);

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
