var token = $.cookie('token');


$(document).ready(function(event){

  token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6ImRvbm4iLCJhdXRoIjoxLCJ1aWQiOiI1MTdjZWQyZi00MzRkLTQ4ZDEtODhlMS1hNTg3MmVkOTlhOGYiLCJpYXQiOjE0ODc3NDM3MjcsImV4cCI6MTQ4NzgzMDEyN30.dQHXAgoq23ryCoB9ET9LEhiHkcPStfSyKU1EIx-zXb8';

  if (!event) event = window.event;
  nav_binding(event, token);

  // console.info($('input[name="categoryId-text"]').val());

  dataPrepare();

  button_sumbit_binding();

});

var button_sumbit_binding = function() {

  $('#categoryUpdate-button').bind('click', function(){

    console.info($('input[name="categoryName-text"]').val());
    console.info($('input[name="categoryParentId-text"]').val());

    var formData = new FormData();
    formData.append('name', $('input[name="categoryName-text"]').val());
    formData.append('categoryParentId', $('input[name="categoryParentId-text"]').val());
    formData.append('image', $('input[name="categoryImage-file"]')[0].files[0], $('input[name="categoryImage-file"]').val());

    $.ajax({
      url: vacapiDomain + '/v0/clothCategory/' + $('input[name="categoryId-text"]').val(),
      method: 'PUT',
      contentType: false,
      processData: false,
      data: formData,
      beforeSend: function(request) {
        $('#categoryUpdate-button').prop('disabled', true);
      }
    }).done(function(result){
      console.info(result);
      if (result.status==='_OK') {
        console.info("_OK");
        $('#category-update-response').empty().text('Update Success');
      } else {
        console.info("_Failure");
        $('#category-update-response').empty().text('Update Failure');
      }
    }).fail(function(err){
      console.error(err);
      $('#category-update-response').empty().text('Update Failure');
    }).always(function(){
      console.info('always');
      $('#categoryUpdate-button').prop('disabled', false);
    });
  });
}

var pageRender = function(map, nameMap) {

  // var innerHtml = '<option disabled selected value> -- select an option -- </option>';
  for (var key in map) {
    for (var key2 in map[key]) {
      if (key2===$('input[name="categoryParentId-text"]').val()) {
        $('.category-select').empty().append('<div>'+nameMap[key2]+'</div>');
        break;
      }
    }
  }
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

    pageRender(map, nameMap);
  }).fail(function(err){
    console.error(err);
  });
}
