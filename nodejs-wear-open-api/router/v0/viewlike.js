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

  var ids = req.query.ids;
  if (ids && ids.indexOf(',')>0) {
    ids = ids.split(',');
    console.info(ids);
    ids.forEach(function(item){
      if (item.length!=36) {
        res.send({
          status: "_ERR",
          time: new Date().getTime()
        });
      }
    });
  }

  knexData.select('Combination_Master_ID as masterId', 'View as view', 'Like as like')
  .from('Combination_Master')
  .where('Status_ID', 1)
  .where(function(){
    if (ids && ids.length>0) {
      this.where('Combination_Master_ID', 'in', ids);
    }
  })
  .orderBy('Update_Time', 'desc')
  .orderBy('Combination_Master_ID', 'asc')
  .offset(0)
  .limit(20)
  .then(function(result) {
    // console.info(result);
    res.send({
      status: "_OK",
      time: new Date().getTime(),
      data: result
    });
  }).catch(function(err){
    console.error(err);
    res.send({
      status: "_ERR",
      time: new Date().getTime()
    });
  });

}

exports.show = function(req, res) {
  var id = req.params.id;

  knexData.select('Combination_Master_ID as masterId', 'View as view', 'Like as like')
  .from('Combination_Master')
  .where('Status_ID', 1)
  .where('Combination_Master_ID', id)
  .then(function(result) {
    // console.info(result);
    res.send({
      status: "_OK",
      time: new Date().getTime(),
      data: result[0]
    });
  }).catch(function(err){
    console.error(err);
    res.send({
      status: "_ERR",
      time: new Date().getTime()
    })
  });
}

exports.update = function(req, res) {
  var id = req.params.id;
  var ob = req.body.ob;
  var op = req.body.op;

  var column = '';
  var operator = '';
  var limitation = '';

  if (ob==='view') {
    column = 'View';
    operator = '+1';
    limitation = '=`View`';
  } else if (ob==='like') {
    column = 'Like';
    if (op==='+') {
      operator = '+1';
      limitation = '=`Like`';
    } else if (op==='-'){
      operator = '-1';
      limitation = '>0';
    } else {
      res.send({
        status: "_ERR",
        time: new Date().getTime()
      });
    }
  } else {
    res.send({
      status: "_ERR",
      time: new Date().getTime()
    });
  }

  knexData.raw('update Combination_Master '
    +' set `'+column+'`=`'+column+'`'+operator+' '
    +' where Combination_Master_ID=? and Status_ID=1 '
    +' and `'+column+'`'+limitation, id)
  .then(function(result){
    res.send({
      status: "_OK",
      time: new Date().getTime()
    });
  }).catch(function(err){
    console.error(err);
    res.send({
      status: "_ERR",
      time: new Date().getTime()
    });
  });

}
