/*****
* npm Import
*****/
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');

/*****
* Routing Module
*****/
var test = require('./router/test');
var auth0 = require('./router/auth0');
var general = require('./router/v0/general');
var category = require('./router/v0/category');
var color = require('./router/v0/color');
var pattern = require('./router/v0/pattern');
var look = require('./router/v0/look');
var vl = require('./router/v0/viewlike');


/*****
* Const Import
*****/
var config = require('./../config');
const superKey = config.secret;
const env = config.env;
const port = config.openApiPort;

/*****
* API setup, use middleware
*****/
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/api', expressJwt({
  secret: superKey,
  credentialsRequired: false
}).unless({
  path: [
    '/api/auth', '/api/test'
  ]
}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === 'OPTIONS') {
    return res.send(200);
  } else {
    return next();
  }
});

/*****
* API routing
*****/
app.post('/api/auth', auth0.post);

app.get('/api/test', test.foo);

app.get('/api/v0/general', general.general);



app.get('/api/v0/look', look.index);


app.get('/api/v0/category', category.index);
app.get('/api/v0/color', color.index);
app.get('/api/v0/pattern', pattern.index);

app.get('/api/v0/vl', vl.index);
app.get('/api/v0/vl/:id', vl.show);
app.put('/api/v0/vl/:id', vl.update);

app.listen(port, function() {
  console.info('api server listening at :%s', port);
});

app.use(function(req, res, next){
  res.status(404).send({
    status: '_Failure',
    time: new Date().getTime(),
    error: 'unknown error'
  });
  return;
});

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send({
      status: '_Failure',
      time: new Date().getTime(),
      error: 'invalid token'
    });
  }
});
