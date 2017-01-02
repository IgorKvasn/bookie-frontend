/*jshint node:true*/
module.exports = function(app) {
  var express = require('express');
  var userRouter = express.Router();

  userRouter.get('/', function(req, res) {
    res.send({
      'user': []
    });
  });

  userRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  userRouter.get('/:id', function(req, res) {
    res.send({
      'user': {
        id: req.params.id
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
  //app.use('/api/user', require('body-parser').json());
  app.use('/api/user', userRouter);
};
