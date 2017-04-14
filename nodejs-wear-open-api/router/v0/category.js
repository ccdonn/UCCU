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
  knexData.select('Category_ID as categoryId', 'Parent as parent'
    , 'Name as name', 'Picture as picture')
  .from('Cloth_Category as cc')
  .where('cc.Status_ID', 1)
  .then(function(result){
    result.forEach(function(item){
      if (item.picture) {
        item.picture = config.categoryIconPath + item.picture;
      } else {
        item.picture = config.categoryIconPath + 'default.jpg';
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
      status: "_Failure",
      time: new Date().getTime()
    });
  });
};
