'use strict';

function logUserIn(userData) {
  const settings = {
    url: '/auth/login',
    data: JSON.stringify(userData),
    method: 'POST',
    contentType: "application/json",
    success: function(data) {
      localStorage.setItem('token', data.authToken);
      localStorage.setItem('user', userData.username);
      window.location.href = '/my-list.html';
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
    password: $('#password').val()
  };
  
  logUserIn(userData);
})