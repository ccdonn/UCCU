var token = $.cookie('token');


$(document).ready(function(event){

  token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6ImRvbm4iLCJhdXRoIjoxLCJ1aWQiOiI1MTdjZWQyZi00MzRkLTQ4ZDEtODhlMS1hNTg3MmVkOTlhOGYiLCJpYXQiOjE0ODc3NDM3MjcsImV4cCI6MTQ4NzgzMDEyN30.dQHXAgoq23ryCoB9ET9LEhiHkcPStfSyKU1EIx-zXb8';

  if (!event) event = window.event;
  nav_binding(event, token);

  button_create_binding();
});

var button_create_binding = function() {

  $('#colorCreate-button').bind('click', function(){

    console.info($('input[name="colorName-text"]').val());

    var formData = new FormData();
    formData.append('name', $('input[name="colorName-text"]').val());
    formData.append('image', $('input[name="colorImage-file"]')[0].files[0], $('input[name="colorImage-file"]').val());

    $.ajax({
      url: vacapiDomain + '/v0/clothColor/',
      method: 'POST',
      contentType: false,
      processData: false,
      data: formData,
      beforeSend: function(request) {
        if (!$('input[name="colorName-text"]').val()
          || !$('input[name="colorImage-file"]').val()) {
          request.abort();
        }
        $('#colorCreate-button').prop('disabled', true);
      }
    }).done(function(result){
      console.info(result);
      if (result.status==='_OK') {
        console.info("_OK");
        $('#color-create-response').empty().text('Create Success');
        // redirect page
      } else {
        console.info("_Failure");
        $('#color-create-response').empty().text('Create Failure');
        $('#colorCreate-button').prop('disabled', false);
      }
    }).fail(function(err){
      console.error(err);
      $('#color-create-response').empty().text('Create Failure');
      $('#colorCreate-button').prop('disabled', false);
    });
  });
}
