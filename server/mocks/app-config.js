/*jshint node:true*/
module.exports = function(app) {
    var express = require('express');
    var appConfigRouter = express.Router();

    appConfigRouter.get('/', function(req, res) {
      if (req.query.app === 'ID_PROSET'){

        res.send({
            'app-config': {
                id: '1',
                hoursPerDay: 15,
                courtNames: ['K1','K2','K3','K4'],
                startOfDay: 7 //kurty zacinaju o 7:00 kazdy den
            }
        });
        return;
      }
        res.send({
            'app-config': []
        });
    });



    appConfigRouter.get('/:id', function(req, res) {
        res.send({
            'app-config': {
            }
        });
    });


    // The POST and PUT call will not contain a request body
    // because the body-parser is not included by default.
    // To use req.body, run:

    //    npm install --save-dev body-parser

    // After installing, you need to `use` the body-parser for
    // this mock uncommenting the following line:
    //
    //app.use('/api/app-config', require('body-parser').json());
    app.use('/api/app-config', appConfigRouter);
};
