/*****
* npm Import
*****/
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

/*****
* Routing Module
*****/
var test = require('./router/test');
var auth0 = require('./router/auth0');
var general = require('./router/v0/general');
var cloth = require('./router/v0/cloth');
var user = require('./router/v0/user');
var explore = require('./router/v0/explore');
var clothCategory = require('./router/v0/clothCategory');
var clothColor = require('./router/v0/clothColor');
var clothPattern = require('./router/v0/clothPattern');
var look = require('./router/v0/look');

/*****
* Const Import
*****/
var config = require('./../config');
const superKey = config.secret;
const env = config.env;
const port = config.apiPort;

/*****
* API setup, use middleware
*****/
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
// app.use('/api', expressJwt({
//   secret: superKey,
//   credentialsRequired: false
// }).unless({
//   path: [
//     '/api/auth', '/api/test', '/api/v0/user/flogin', '/api/v0/user/r0',
//     '/api/login'
//   ]
// }));
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


app.get('/api/v0/user/:id', user.show);

app.get('/api/v0/cloth/:id', cloth.show);
app.get('/api/v0/cloth', cloth.index);
app.post('/api/v0/cloth', multipartMiddleware, cloth.add);
app.put('/api/v0/cloth/:id', multipartMiddleware, cloth.update);
app.delete('/api/v0/cloth/:id', cloth.delete);

app.get('/api/v0/explore', explore.index);
app.get('/api/v0/explore/:id', explore.show);

app.get('/api/v0/clothCategory', clothCategory.index);
app.post('/api/v0/clothCategory', multipartMiddleware, clothCategory.create);
app.get('/api/v0/clothCategory/:id', clothCategory.show);
app.put('/api/v0/clothCategory/:id', multipartMiddleware, clothCategory.update);
app.delete('/api/v0/clothCategory/:id', clothCategory.delete);

app.get('/api/v0/clothColor', clothColor.index);
app.post('/api/v0/clothColor', multipartMiddleware, clothColor.create);
app.get('/api/v0/clothColor/:id', clothColor.show);
app.put('/api/v0/clothColor/:id', multipartMiddleware, clothColor.update);
app.delete('/api/v0/clothColor/:id', clothColor.delete);

app.get('/api/v0/clothPattern', clothPattern.index);

app.get('/api/v0/look', look.index);
app.get('/api/v0/look/:id', look.show);

app.get('/api/login', auth0.flogin);

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
