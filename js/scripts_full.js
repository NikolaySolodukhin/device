var writeus_popup = document.querySelector(".writeus_popup");
var show_writeus = document.querySelector(".js_show_writeus");
var close_writeus_popup = document.querySelector(".js_writeus_close");
var map_popup = document.querySelector(".map_popup");
var show_map = document.querySelector(".js_show_map");
var close_map_popup = document.querySelector(".js_map_close");
var form = document.querySelector(".writeus");
var name = document.querySelector(".name");
var email = document.querySelector(".e_mail");
var message = document.querySelector("[name=message]");

show_writeus.addEventListener("click", function(event) {
  event.preventDefault();
  writeus_popup.classList.add("show_popup");
});

close_writeus_popup.addEventListener("click", function(event) {
  event.preventDefault();
  writeus_popup.classList.remove("show_popup");

});


show_map.addEventListener("click", function(event) {
  event.preventDefault();
  map_popup.classList.add("show_popup");
});

close_map_popup.addEventListener("click", function(event) {
  event.preventDefault();
  map_popup.classList.remove("show_popup");
});


form.addEventListener("submit", function(event) {
  if (!email.value || !name.value || !message.value) {
    event.preventDefault();
    email.classList.add("invalid");
    name.classList.add("invalid");
    message.classList.add("invalid");
  }
});
