'use strict';

function logUserIn(userData) {
  const settings = {
    url: '/auth/login',
    data: userData,
    content-type: 'application/json',
    type: 'POST',
    success: function(data) {
      localStorage.setItem('token', data.authToken);
      localStorage.setItem('user', userData.username);
      console.log("success")
      window.location.href = 'dashboard.html';
    },
    error: function(data) {
      console.log("Error: user authentication failed.");
      alert("Error: Incorrect name and password combination");
    }
  };
  $.ajax(settings);
}

$('.setup-form').submit( function(event) {
  event.preventDefault()
  let userData = {
    username: $('#username').val(),
    password: $('#password').val(),
  };
  logUserIn(userData);
})