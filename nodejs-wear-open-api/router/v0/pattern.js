var config = require('./../../../config');
var knexData = require('knex')({
  client: 'mysql',
  connection: {
    host: config.sqlHost,
    port: config.sqlPort,
    user: config.sqlUser,
    password: config.sqlPass,
    database: 'rcloset'
  }
});


exports.index = function(req, res) {
  res.send({
    status: "_OK",
    time: new Date().getTime()
  });
};
