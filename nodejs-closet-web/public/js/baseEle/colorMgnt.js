var token = $.cookie('token');


$(document).ready(function(event){

  token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6ImRvbm4iLCJhdXRoIjoxLCJ1aWQiOiI1MTdjZWQyZi00MzRkLTQ4ZDEtODhlMS1hNTg3MmVkOTlhOGYiLCJpYXQiOjE0ODc3NDM3MjcsImV4cCI6MTQ4NzgzMDEyN30.dQHXAgoq23ryCoB9ET9LEhiHkcPStfSyKU1EIx-zXb8';

  if (!event) event = window.event;
  nav_binding(event, token);

  button_delete_binding();

  $(function(){$("img").lazyload();});
});

var button_delete_binding = function() {
  $('.delete a').bind('click', function() {
    // console.info('delete click:'+$(this).attr('meta-id')+','+$(this).attr('meta-pid')+','+$(this).attr('meta-name'));
    var deleteId = $(this).attr('meta-id');
    var deleteName = $(this).attr('meta-name');

    if (confirm('Remove color '+$(this).attr('meta-name')+'?')) {
      $.ajax({
        url: vacapiDomain + '/v0/clothColor/' + $(this).attr('meta-id'),
        method: 'DELETE'
      }).done(function(result){
        if (result.status==='_OK') {
          console.info('ok');
          $('tr').each(function(){
            // console.info($(this).attr('meta-id'));
            if ($(this).attr('meta-id')===deleteId) {
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
