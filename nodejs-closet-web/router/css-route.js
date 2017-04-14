var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');



router.get('/:name', function(req, res){
  if (req.params.name.endsWith('.css')) {
    res.sendFile(path.join(__dirname+'/../public/css/'+req.params.name));
  } else {
    res.sendStatus(404);
  }
});

router.get('/baseEle/:name', function(req, res){
  if (req.params.name.endsWith('.css')) {
    res.sendFile(path.join(__dirname+'/../public/css/baseEle/'+req.params.name));
  } else {
    res.sendStatus(404);
  }
});

router.get('/cloth/:name', function(req, res){
  if (req.params.name.endsWith('.css')) {
    res.sendFile(path.join(__dirname+'/../public/css/cloth/'+req.params.name));
  } else {
    res.sendStatus(404);
  }
});

router.get('/jquery/:name', function(req, res){
  if (req.params.name.endsWith('.css')) {
    res.sendFile(path.join(__dirname+'/../public/css/jquery/'+req.params.name));
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;
