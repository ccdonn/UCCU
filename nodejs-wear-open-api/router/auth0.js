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

exports.flogin = function(req, res) {
  console.info('flogin');
  request('https://graph.facebook.com/v2.5/me?fields=id%2Cname%2Cbirthday%2Cemail%2Cfirst_name%2Clast_name%2Cgender%2Cpicture%7Burl%7D&access_token='
    +'EAACEdEose0cBAETrw6tLdPccRkHdw7HKU3dBVxJbmjaZBTnCdONxw2OTLfn3WMUC43WufVdRpxBIKHp9ZAKF4lZBNageQm2skFV5R38He2sHAUZCgmQmRZB3HZCi6KC0wzZCZBZBMvl65MZAeNbfszXnYV469LeZCixvqd8ReiDhCjntxJiE7nIKGnKkp5Gf21ZB9FgZD',
  function(error, response, body) {
    if (!error && response.statusCode === 200) {
      body = JSON.parse(body);
      console.info(body.id);
      console.info(body.name);
      console.info(body.email);
      console.info(body.gender);
      console.info(body.picture.data.url);

      knexData.from('User')
      .where('Provider', 'facebook')
      .where('Provider_User_ID', body.id)
      .then(function(result){
        console.info(result);
        if (result.length===0) {
          var userEntity = {
            User_ID: uuid.v4(),
            Type: 1,
            Provider: 'facebook',
            Provider_User_ID: body.id,
            Gender: (body.gender)==='female'?1:((body.gender==='male')?2:0),
            Birth: (body.birth)?body.birth:null,
            Name: body.name,
            Mail: body.email,
            Status_ID: 1,
            Create_Time: new Date(),
            Update_Time: new Date()
          }
          knexData('User').insert(userEntity)
          .then(function(result){
            console.info(result);
            res.send('inserted');
          }).catch(function(err){
            console.error(err);
            res.send('error');
          });
          // res.send('should insert');

        } else if (result.length===1){
          console.info(result);
          res.send('gen token');
        } else {
          console.info('eeeeeerror');
          res.send('error');
        }
      }).catch(function(err){
        console.error(err);
      })
    } else {
      res.send('fail');
    }
  });
};
exports.r1 = function(req, res) {
  console.info('r1');
  request('https://graph.facebook.com/v2.5/me?fields=id%2Cname%2Cbirthday%2Cemail%2Cfirst_name%2Clast_name%2Cgender%2Cpicture%7Burl%7D&access_token=EAACEdEose0cBAKGwnPz4ENVfZAZCqVkwDcTfVMZB751JMOW6ETgP6fhX4Yk2oKmPLONOMuxPG3xS6A6FrfQWZAZA6EF0eeS4jt7UBdP1TuxWFIMMwF6abFCDHbZCzXzsPnZC7ZAq70syZBFe8r1oPZAGXYJZBLOEgS8ZBRqvselP8zD3cMWiqS85V1MgkdEzv5SHFxoZD',
  function(error, response, body) {
    if (!error && response.statusCode === 200) {
      console.info(body);
      res.send('success');
    } else {
      res.send('fail');
    }
  });
};

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
