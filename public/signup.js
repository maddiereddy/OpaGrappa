'use strict';

function createNewUser(userData) {
  const settings = {
    url: '/users',
    data: JSON.stringify(userData),
    method: 'POST',
    contentType: "application/json",
    success: function(user) {
      window.location.href = "login.html";
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