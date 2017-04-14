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
  knexData.select('Color_ID as colorId', 'Name as name'
    , 'Picture as picture')
  .from('Cloth_Color as cc')
  .where('cc.Status_ID', 1)
  .then(function(result){
    result.forEach(function(item){
      if (item.picture) {
        item.picture = config.colorIconPath + item.picture;
      } else {
        item.picture = config.colorIconPath + 'default.jpg';
      }
    });
    res.send({
      status: "_OK",
      time: new Date().getTime(),
      data: result
    });
  }).catch(function(err){
    console.error(err);
    res.send({
      status: "_OK",
      time: new Date().getTime()
    });
  });

};
