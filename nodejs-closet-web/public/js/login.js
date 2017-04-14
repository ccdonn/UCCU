var token = $.cookie('wearToken');
$(document).ready(function(event){

  if (!event) event = window.event;

  // console.info('init');
  console.info(token);
  // nav_binding(event, token);

  $('#name').bind('keypress', function(event){
    if (event.keyCode == 13) {
      event.preventDefault();
      $("#send").click();
    }
  });

  $('#pass').bind('keypress', function(event){
    if (event.keyCode == 13) {
      event.preventDefault();
      $("#send").click();
    }
  });


  if (token) {
    $("#status").html("Redirecting page...");
    $("#send").attr("disabled", true);
    $("#name").attr("disabled", true);
    $("#pass").attr("disabled", true);

    setTimeout(function () {
        window.location.href = '/web/index';
    }, 2000);

  } else {
    $("#status").html("No Auth/Not Login");
    // $('#fgtpass').html('<a href="./forgetPass">Forget Password</a>');

    $("#send").bind("click", function(){
      var n = $("#name").val();
      var p = $("#pass").val();
      // console.info("name:"+n);
      // console.info("pass:"+p);

      $.ajax({
        url: 'http://'+host+'/api/auth',
        method: 'POST',
        type: 'POST',
        data: {
          name: n,
          pass: p
        }
      }).done(function(result) {

        if (result && result.data.token) {

          if ($.cookie("wearToken", result.data.token, {expires:new Date(result.data.expire*1000), path:'/'})) {
            $('#loginResult').html('Login Success, Redirecting page...');
            $('#fgtpass').html('');
            setTimeout(function () {
              window.location.href = '/web/index';
            }, 2000);
          } else {
            console.error('Cookie Save fail');
            $('#loginResult').html('Cookie Save Fail');
          }

        } else {
          console.error('login fail');
          $('#loginResult').html('Login Fail');
        }
      });
    });
  }
});
