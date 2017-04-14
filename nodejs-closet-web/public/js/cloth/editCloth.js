var token = $.cookie('token');

$(document).ready(function(event){

  token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6ImRvbm4iLCJhdXRoIjoxLCJ1aWQiOiI1MTdjZWQyZi00MzRkLTQ4ZDEtODhlMS1hNTg3MmVkOTlhOGYiLCJpYXQiOjE0ODc3NDM3MjcsImV4cCI6MTQ4NzgzMDEyN30.dQHXAgoq23ryCoB9ET9LEhiHkcPStfSyKU1EIx-zXb8';

  if (!event) event = window.event;
  nav_binding(event, token);

  pagePrepare();

});

var pagePrepare = function() {
  category();
  color();
}

var color = function() {
  $.ajax({
    url: vacapiDomain + '/v0/clothColor',
    method: 'GET',
    beforeSend: function(request) {
    	// request.setRequestHeader('Authorization', token);
    }
  }).done(function(result){
    var list = [];
    result.data.forEach(function(item){
      list.push(item);
    });
    // console.info(list);
    colorRender(list);
  }).fail(function(err){
    console.error(err);
  });
}

var category = function() {
  $.ajax({
    url: vacapiDomain + '/v0/clothCategory',
    method: 'GET',
    beforeSend: function(request) {
    	// request.setRequestHeader('Authorization', token);
    }
  }).done(function(result){
    var map = {};
    var nameMap = {};


    result.data.forEach(function(item){
      var id = ''+item.categoryId;
      if (id.length===6 && item.parent!==0) {
        var lyr1Id = id.substring(0,1)+'00000';
        var lyr2Id = id.substring(0,3)+'000';
        var lyr3Id = id.substring(3,6);

        if (lyr3Id!='000') {
          if (!map[lyr1Id]) {
            map[lyr1Id] = {};
          }
          if (!map[lyr1Id][lyr2Id]) {
            map[lyr1Id][lyr2Id] = [];
          }
          map[lyr1Id][lyr2Id].push(id);
        }
      }
    });

    result.data.forEach(function(item){
      if(!nameMap[item.categoryId]) {
        nameMap[item.categoryId] = item.name;
      }
    });

    // console.info(map);
    // console.info(nameMap);

    categoryRender(map, nameMap);
  }).fail(function(err){
    console.error(err);
  });
}

var colorRender = function(list) {
  var innerHtml = '<option disabled selected value> -- select an option -- </option>';
  list.forEach(function(item){
    if ($('#color').attr('colorid')==item.colorId) {
      innerHtml += '<option value="'+item.colorId+'" selected>'+item.name+'</option>';
    } else {
      innerHtml += '<option value="'+item.colorId+'">'+item.name+'</option>';
    }
  });
  $('.color-select').empty().append('<select>'+innerHtml+'</select>');
}

var categoryRender = function(map, nameMap) {

  var innerHtml = '<option disabled selected value> -- select an option -- </option>';
  for (var key in map) {
    for (var key2 in map[key]) {
      innerHtml += '<optgroup label="'+nameMap[key2]+'">';
      for (var key3 in map[key][key2]) {
        if (map[key][key2][key3]==$('#category').attr('categoryid')) {
          innerHtml += '<option value="'+map[key][key2][key3]+'" selected>'+nameMap[map[key][key2][key3]]+'</option>';
        } else {
          innerHtml += '<option value="'+map[key][key2][key3]+'">'+nameMap[map[key][key2][key3]]+'</option>';
        }
      }
      innerHtml += '</optgroup>';
    }
  }
  $('.category-select').empty().append('<select>'+innerHtml+'</select>');
}
