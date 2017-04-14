var jwt = require('jsonwebtoken');
var config = require('./../../config');
var request = require('request');
var uuid = require('uuid');

const superSecret = config.secret;
const superRSecret = config.rsecret;
const sqlHost = config.sqlHost;
const sqlPort = config.sqlPort;
const sqlUser = config.sqlUser;
const sqlPass = config.sqlPass;
const mgrDB = config.mgrDB;

var knex = require('knex')({
  client: 'mysql',
    connection: {
    host: sqlHost,
    port: sqlPort,
    user: sqlUser,
    password: sqlPass,
    database: mgrDB
  }
});

var knexData = require('knex')({
  client: 'mysql',
    connection: {
    host: sqlHost,
    port: sqlPort,
    user: sqlUser,
    password: sqlPass,
    database: 'rcloset'
  }
});



exports.post = function(req, res) {

  var inputname = req.body.name;
  var inputpass = req.body.pass;

  if (inputname==undefined || inputname=='' || inputpass==undefined || inputpass=='') {
    res.send({
      status:'_Failure',
      time: new Date().getTime()
    });
  } else {
    knex.column('id', 'name', 'auth').select().from('user')
      .whereNotNull('password')
      .andWhere('name', inputname)
      .andWhere('status', 1)
      .andWhere(knex.raw('password=password(?)', inputpass))
      .then(function(result){
        if (result && result.length>0) {
          console.info ('result'+result);
          console.info('result[0].id='+result[0].id);
          console.info('result[0].name='+result[0].name);
          result[0].uid='517ced2f-434d-48d1-88e1-a5872ed99a8f';
          var token = jwt.sign(result[0], superSecret, {
            expiresIn: '24h'
          });
          var rtoken = jwt.sign(result[0], superRSecret, {
            expiresIn: '20y'
          });
          res.send({
            status: '_OK',
            time: new Date().getTime(),
            date: {
              token: 'Bearer ' + token,
              rtoken: 'Bearer ' + rtoken,
              expire: jwt.decode(token, superSecret).exp
            }
          });
        } else {
          res.send({
            status: '_Failure',
            time: new Date().getTime()
          });
        }
      }).catch(function(err){
        console.error(err);
        res.send({
          status: '_Failure',
          time: new Date().getTime()
        });
      });
  }
}
