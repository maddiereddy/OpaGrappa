'use strict';

// Get this user's JWT and store it locally for use in other pages:
function getAndStoreJwt(userData) {
  const settings = {
    url: '/auth/login',
    data: JSON.stringify(userData),
    method: 'POST',
    contentType: "application/json",
    success: function(data) {
      localStorage.setItem('token', data.authToken);
      localStorage.setItem('user', userData.username);
      window.location.href = '/dashboard.html';
    },
    error: function(data) {
      console.log("Error: user authentication failed.");
      alert("Error: Incorrect name and password combination");
    }
  };
  $.ajax(settings);
}

// create a new user account by calling api
function createNewUser(userData) {
  const settings = {
    url: '/users',
    data: JSON.stringify(userData),
    method: 'POST',
    contentType: "application/json",
    success: function(user) {
      getAndStoreJwt(userData);
    },
    error: function(data) {
      console.log("Error: API could not create a new user.");
      alert(data.responseJSON.location + " error: " + data.responseJSON.message);
    }
  };
  $.ajax(settings);
}

// button click or form submit to create a new user account
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