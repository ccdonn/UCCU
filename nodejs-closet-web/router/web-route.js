
var express = require('express');
var webRoutes = express.Router();
var request = require('request');
var urlencode = require('urlencode');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var fs = require('fs');

var config = require('./../../config');

webRoutes.use(cookieParser());

webRoutes.get('/login', function(req, res){
  console.info('login page');
  res.render('login');
});

webRoutes.get('/index', function(req, res){
  console.info('index page');
  res.render('index');
});

webRoutes.get('/cloth/clothMgnt', function(req, res){
  console.info('clothMgnt page');
  var options = {
    url: 'http://localhost:3101/api/v0/cloth',
    headers: {
      // 'Authorization': req.cookies.wearToken
      // 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6ImRvbm4iLCJhdXRoIjoxLCJ1aWQiOiI1MTdjZWQyZi00MzRkLTQ4ZDEtODhlMS1hNTg3MmVkOTlhOGYiLCJpYXQiOjE0ODc2Njc5NjQsImV4cCI6MTQ4Nzc1NDM2NH0.KaZ28YdyVivZfHBqzLzl3beEbS4v3yuI2qQMoP-0LTg'
    }
  };

  request(options, function(e, r, body){
    body = JSON.parse(body);
    if (!e && r.statusCode === 200 && body.status === "_OK") {
      console.info(body);
      // console.info(body.status);
      res.render('cloth/clothMgnt', body);
    } else {
      res.render('40x', { url: req.url });
    }
  });

});

webRoutes.get('/cloth/create', function(req, res){
  console.info('createCloth page');
  res.render('cloth/createCloth');
});

webRoutes.get('/cloth/:id/edit', function(req, res){
  console.info('editCloth page');
  var options = {
    url: 'http://localhost:3101/api/v0/cloth/'+ req.params.id,
    headers: {
    }
  };

  request(options, function(e, r, body){
    body = JSON.parse(body);
    if (!e && r.statusCode === 200 && body.status === "_OK") {
      console.info(body);
      // console.info(body.status);
      res.render('cloth/editCloth', body);
    } else {
      res.render('40x', { url: req.url });
    }
  });

});

webRoutes.get('/look/lookMgnt', function(req, res){
  console.info('lookMgnt page');
  res.render('look/lookMgnt');
});

webRoutes.get('/baseEle/categoryMgnt', function(req, res){
  console.info('categoryMgnt page');
  var options = {
    url: 'http://localhost:3101/api/v0/clothCategory',
    headers: {
      // 'Authorization': req.cookies.wearToken
      // 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6ImRvbm4iLCJhdXRoIjoxLCJ1aWQiOiI1MTdjZWQyZi00MzRkLTQ4ZDEtODhlMS1hNTg3MmVkOTlhOGYiLCJpYXQiOjE0ODc2Njc5NjQsImV4cCI6MTQ4Nzc1NDM2NH0.KaZ28YdyVivZfHBqzLzl3beEbS4v3yuI2qQMoP-0LTg'
    }
  };

  request(options, function(e, r, body){
    body = JSON.parse(body);

    if (!e && r.statusCode === 200 && body.status === "_OK") {
      // console.info(body);
      // console.info(body.status);
      res.render('baseEle/categoryMgnt', body);
    } else {
      res.render('40x', { url: req.url });
    }
  });

});

webRoutes.get('/baseEle/category/create', function(req, res){
  console.info('createCategory page');
  res.render('baseEle/createCategory');
});

webRoutes.get('/baseEle/category/:id/edit', function(req, res){
  console.info('editCategory page');

  var id = req.params.id;

  var options = {
    url: 'http://localhost:3101/api/v0/clothCategory/' + id,
    method: 'GET',
    headers: {
    }
  };

  request(options, function(e, r, body){
    body = JSON.parse(body);
    if (!e && r.statusCode === 200 && body.status === "_OK") {
      // console.info(body);
      // console.info(body.status);
      res.render('baseEle/editCategory', body);
    } else {
      console.error("ERR")
      res.render('40x', { url: req.url });
    }
  });

});

webRoutes.get('/baseEle/colorMgnt', function(req, res){
  console.info('colorMgnt page');
  var options = {
    url: 'http://localhost:3101/api/v0/clothColor',
    headers: {
      // 'Authorization': req.cookies.wearToken
      // 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6ImRvbm4iLCJhdXRoIjoxLCJ1aWQiOiI1MTdjZWQyZi00MzRkLTQ4ZDEtODhlMS1hNTg3MmVkOTlhOGYiLCJpYXQiOjE0ODc2Njc5NjQsImV4cCI6MTQ4Nzc1NDM2NH0.KaZ28YdyVivZfHBqzLzl3beEbS4v3yuI2qQMoP-0LTg'
    }
  };

  request(options, function(e, r, body){
    body = JSON.parse(body);
    if (!e && r.statusCode === 200 && body.status === "_OK") {
      console.info(body);
      // console.info(body.status);
      res.render('baseEle/colorMgnt', body);
    } else {
      res.render('40x', { url: req.url });
    }
  });

});

webRoutes.get('/baseEle/color/create', function(req, res){
  console.info('colorCategory page');
  res.render('baseEle/createColor');
});

webRoutes.get('/baseEle/color/:id/edit', function(req, res){
  console.info('editColor page');

  var id = req.params.id;

  var options = {
    url: 'http://localhost:3101/api/v0/clothColor/' + id,
    method: 'GET',
    headers: {
    }
  };

  request(options, function(e, r, body){
    body = JSON.parse(body);
    if (!e && r.statusCode === 200 && body.status === "_OK") {
      // console.info(body);
      // console.info(body.status);
      res.render('baseEle/editColor', body);
    } else {
      console.error("ERR")
      res.render('40x', { url: req.url });
    }
  });

});


webRoutes.get('/profile/ChangePasswd', function(req, res){
  console.info('user passwd page');
  res.render('profile/ChangePasswd');
});

// other exception -> 40x page
webRoutes.use(function(req, res, next){
  res.status(404);
  // respond with html page
  res.render('40x', { url: req.url });
  return;
});

module.exports = webRoutes;
