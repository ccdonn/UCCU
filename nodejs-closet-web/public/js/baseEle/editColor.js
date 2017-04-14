var token = $.cookie('token');


$(document).ready(function(event){

  token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6ImRvbm4iLCJhdXRoIjoxLCJ1aWQiOiI1MTdjZWQyZi00MzRkLTQ4ZDEtODhlMS1hNTg3MmVkOTlhOGYiLCJpYXQiOjE0ODc3NDM3MjcsImV4cCI6MTQ4NzgzMDEyN30.dQHXAgoq23ryCoB9ET9LEhiHkcPStfSyKU1EIx-zXb8';

  if (!event) event = window.event;
  nav_binding(event, token);

  // console.info($('input[name="categoryId-text"]').val());

  button_sumbit_binding();

});

var button_sumbit_binding = function() {
  $('#colorUpdate-button').bind('click', function(){

    console.info($('input[name="colorId-text"]').val());
    console.info($('input[name="colorName-text"]').val());

    var formData = new FormData();
    formData.append('name', $('input[name="colorName-text"]').val());
    formData.append('image', $('input[name="colorImage-file"]')[0].files[0], $('input[name="colorImage-file"]').val());

    $.ajax({
      url: vacapiDomain + '/v0/clothColor/' + $('input[name="colorId-text"]').val(),
      method: 'PUT',
      contentType: false,
      processData: false,
      data: formData,
      beforeSend: function(request) {
        $('#colorUpdate-button').prop('disabled', true);
      }
    }).done(function(result){
      console.info(result);
      if (result.status==='_OK') {
        console.info("_OK");
        $('#color-update-response').empty().text('Update Success');
      } else {
        console.info("_Failure");
        $('#color-update-response').empty().text('Update Failure');
      }
    }).fail(function(err){
      console.error(err);
      $('#color-update-response').empty().text('Update Failure');
    }).always(function(){
      console.info('always');
      $('#colorUpdate-button').prop('disabled', false);
    });
  });

}
