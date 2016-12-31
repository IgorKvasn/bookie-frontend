/*jshint node:true*/
var moment = require('moment');

module.exports = function(app) {
    var express = require('express');
    var courtsRouter = express.Router();

    courtsRouter.get('/', function(req, res) {
        res.send([{
                date: Date.now()
            },
            {
                date: Date.now()
            },
            {
                date: Date.now()
            }
        ]);


        //-------nothing found
        // res.send([]);
    });


    // The POST and PUT call will not contain a request body
    // because the body-parser is not included by default.
    // To use req.body, run:

    //    npm install --save-dev body-parser

    // After installing, you need to `use` the body-parser for
    // this mock uncommenting the following line:
    //
    //app.use('/api/courts', require('body-parser').json());
    app.use('/api/search-booking', courtsRouter);
};
