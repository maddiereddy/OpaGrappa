'use strict';

$('#create-account').on('click', function (event) {
  event.preventDefault();
  console.log("here")
  window.location.href="./views/signup.html"
})

$('#login-account').on('click', function (event) {
  event.preventDefault();
  window.location.href="./views/login.html"
})