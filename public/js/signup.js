'use strict';

// Gett this user's JWT and store it locally for use in other pages:
function getAndStoreJwt(userData) {
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


function createNewUser(userData) {
  const settings = {
    url: '/users',
    data: JSON.stringify(userData),
    method: 'POST',
    contentType: "application/json",
    success: function(user) {
      getAndStoreJwt(userData);
      // window.location.href = "login.html";
    },
    error: function(data) {
      console.log("Error: API could not create a new user.");
      alert(data.responseJSON.location + " error: " + data.responseJSON.message);
    }
  };
  $.ajax(settings);
}

$('.setup-form').submit( function(event) {
  event.preventDefault();
  
  let newUserData = {
    username: $('#username').val(),
    password: $('#password').val(),
    confirmPassword: $('#confirm-password').val()
  };

  if (newUserData.password !== newUserData.confirmPassword) {
    alert("Your passwords do not match! Enter and confirm a password.");
  } else {
    createNewUser(newUserData);
  }
})