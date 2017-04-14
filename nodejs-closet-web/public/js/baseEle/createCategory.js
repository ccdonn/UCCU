var token = $.cookie('token');


$(document).ready(function(event){

  token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6ImRvbm4iLCJhdXRoIjoxLCJ1aWQiOiI1MTdjZWQyZi00MzRkLTQ4ZDEtODhlMS1hNTg3MmVkOTlhOGYiLCJpYXQiOjE0ODc3NDM3MjcsImV4cCI6MTQ4NzgzMDEyN30.dQHXAgoq23ryCoB9ET9LEhiHkcPStfSyKU1EIx-zXb8';

  if (!event) event = window.event;
  nav_binding(event, token);

  dataPrepare();

  button_create_binding();
});

var button_create_binding = function() {

  $('#categoryCreate-button').bind('click', function(){

    console.info($('input[name="categoryName-text"]').val());
    console.info($('select[name="categoryParentId-select"] option:selected').val());


    var formData = new FormData();
    formData.append('name', $('input[name="categoryName-text"]').val());
    formData.append('categoryParentId', $('select[name="categoryParentId-select"] option:selected').val());
    formData.append('image', $('input[name="categoryImage-file"]')[0].files[0], $('input[name="categoryImage-file"]').val());

    $.ajax({
      url: vacapiDomain + '/v0/clothCategory/',
      method: 'POST',
      contentType: false,
      processData: false,
      data: formData,
      beforeSend: function(request) {
        if (!$('input[name="categoryName-text"]').val()
          || !$('select[name="categoryParentId-select"] option:selected').val()
          || !$('input[name="categoryImage-file"]').val()) {
          request.abort();
        }
        $('#categoryCreate-button').prop('disabled', true);
      }
    }).done(function(result){
      console.info(result);
      if (result.status==='_OK') {
        console.info("_OK");
        $('#category-create-response').empty().text('Create Success');
        // redirect page
      } else {
        console.info("_Failure");
        $('#category-create-response').empty().text('Create Failure');
        $('#categoryCreate-button').prop('disabled', false);
      }
    }).fail(function(err){
      console.error(err);
      $('#category-create-response').empty().text('Create Failure');
      $('#categoryCreate-button').prop('disabled', false);
    });
  });
}


var pageRender = function(map, nameMap) {

  var innerHtml = '<option disabled selected value> -- select an option -- </option>';
  innerHtml += '<option value="0">As Parent</option>';
  for (var key in map) {
    console.info('key='+key);
    for (var key2 in map[key]) {
      console.info('key2='+map[key][key2]);

      innerHtml += '<option value="'+map[key][key2]+'">'+nameMap[map[key][key2]]+'</option>';
    }
  }
  $('.category-select').empty().append('<select name="categoryParentId-select">'+innerHtml+'</select>');
}

var dataPrepare = function() {
  $.ajax({
    url: vacapiDomain + '/v0/clothCategory',
    method: 'GET',
    beforeSend: function(request) {
    	// request.setRequestHeader('Authorization', token);
    }
  }).done(function(result){
    var map = {};
    var nameMap = {};

    console.info(result);

    result.data.forEach(function(item){
      var id = ''+item.categoryId;
      if (id.length===6 && item.parent==0) {
        console.info(id);

        var pid = parseInt(id/100000) * 100000;
        if (!map[pid]){
          map[pid] = [];
        }
        map[pid].push(id);

      }
    });

    result.data.forEach(function(item){
      if(!nameMap[item.categoryId]) {
        nameMap[item.categoryId] = item.name;
      }
    });


    pageRender(map, nameMap);
  }).fail(function(err){
    console.error(err);
  });
}
