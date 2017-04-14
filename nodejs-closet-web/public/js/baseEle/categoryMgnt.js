var token = $.cookie('token');


$(document).ready(function(event){

  token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6ImRvbm4iLCJhdXRoIjoxLCJ1aWQiOiI1MTdjZWQyZi00MzRkLTQ4ZDEtODhlMS1hNTg3MmVkOTlhOGYiLCJpYXQiOjE0ODc3NDM3MjcsImV4cCI6MTQ4NzgzMDEyN30.dQHXAgoq23ryCoB9ET9LEhiHkcPStfSyKU1EIx-zXb8';

  if (!event) event = window.event;
  nav_binding(event, token);

  // dataPrepare();
  button_delete_binding();

  $(function(){$("img").lazyload();});
});

var button_delete_binding = function() {
  $('.delete a').bind('click', function() {
    // console.info('delete click:'+$(this).attr('meta-id')+','+$(this).attr('meta-pid')+','+$(this).attr('meta-name'));
    var deleteId = $(this).attr('meta-id');
    var deletePid = $(this).attr('meta-pid');
    var deleteName = $(this).attr('meta-name');

    if (confirm('Remove category '+$(this).attr('meta-name')+'\nand all subCategorys belong to it?')) {
      $.ajax({
        url: vacapiDomain + '/v0/clothCategory/' + $(this).attr('meta-id'),
        method: 'DELETE'
      }).done(function(result){
        if (result.status==='_OK') {
          console.info('ok');
          $('tr').each(function(){
            // console.info($(this).attr('meta-id'));
            if ($(this).attr('meta-id')===deleteId || $(this).attr('meta-pid')===deleteId) {
              // console.info($(this).attr('meta-id'));
              $(this).remove().fadeOut(3000);
            }
          });
        } else {
          console.info('fail');
        }
      }).fail(function(err){
        console.info('Err');
      });
    }
  });
}

var pageRender = function(map, nameMap) {

  var innerHtml = '<option disabled selected value> -- select an option -- </option>';
  for (var key in map) {
    for (var key2 in map[key]) {
      innerHtml += '<optgroup label="'+nameMap[key2]+'">';
      for (var key3 in map[key][key2]) {
        // console.info(map[midcls][key2][key3]);
        innerHtml += '<option value="'+map[key][key2][key3]+'">'+nameMap[map[key][key2][key3]]+'</option>';
      }
      innerHtml += '</optgroup>';
    }
  }
  $('.category-select').empty().append('<select id="test-select">'+innerHtml+'</select>');
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

    console.info(map);
    console.info(nameMap);

    pageRender(map, nameMap);
  }).fail(function(err){
    console.error(err);
  });
}
