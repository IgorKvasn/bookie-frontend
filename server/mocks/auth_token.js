/*jshint node:true*/
module.exports = function(app) {
  var express = require('express');
  var userRouter = express.Router();


  userRouter.post('/', function(req, res) {
    setTimeout(function() {
      if (req.body.password === 'a' && req.body.identification === 'a') {
        res.status(200).send({
          token: 'this is ember mock token',
          email: 'jozko@gmail.com',
          phone: '09012345678',
          name: 'Jozko Jahoda',
          id: 'user1_ID'
        });
      } else {
        res.status(401).send();
      }
    }, 2000);
  });




  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  app.use('/api/auth_token', require('body-parser').json());
  app.use('/api/auth_token', userRouter);
};
