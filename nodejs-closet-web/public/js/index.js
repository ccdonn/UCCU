var token = $.cookie('token');

$(document).ready(function(event){
  if (!event) event = window.event;
  nav_binding(event, token);
});
