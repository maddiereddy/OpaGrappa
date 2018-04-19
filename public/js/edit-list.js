'use strict';

let user = localStorage.getItem('user');
let token = localStorage.getItem('token');
let wineObj = {};

// Pop up window to display message that a comment was added or updated
function displayModal(header, str1, str2, bRefresh) {
  $('body').append(`
    <div class="overlay">
      <div class="popup">
        <div class="modal-header">
          <span class="close"><i class="fa fa-times" aria-hidden="true"></i></span>
          <p>${header}</p>
        </div>
        <div class="modal-body">
          <span>${str1}</span>
          <p>${str2}</p>
        </div>
      </div>
    </div>`);

  $('.close').click(function () {
    $('.overlay').remove();
    if (bRefresh) window.location.reload(true);
  })
}

// add or edit comments on selected wine from list
$('.wine-details-section').submit(function(event) {
	event.preventDefault();

  wineObj.comments = $("#wine-comments").val();

  const settings = {
    url: `/mylist/${wineObj.id}`,
    data: JSON.stringify(wineObj),
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
    contentType: "application/json",
    success: function(wine) {
      displayModal(`Add or Update Comments`, "Comments field has been updated!", "", true);
      // window.location.reload(true);
    },
    error: function(data) {
      console.log("Error: API could not update list item.");
    }
  };
  $.ajax(settings);
})

// delete selected wine from list
$("#delete-button").click(function(event) {
  event.preventDefault();

  const settings = {
    url: `/mylist/${wineObj.id}`,
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
    contentType: "application/json",
    success: function(wine) {
      window.location.href = 'my-list.html';
    },
    error: function(data) {
      console.log("Error: API could not delete list item.");
    }
  };
  $.ajax(settings);
});

// go back
$("#back-button").click(function() {
	window.history.back();
});

// get details of selected wine
function getDetails(id) {
	const settings = {
    url: `/mylist/${id}`,
    headers: { 'Authorization': `Bearer ${token}` },
    dataType: 'json',
    type: 'GET',
    success: function(wine) {
    	wineObj = wine;
      renderDetails();
    },
    error: function(data) {
      console.log("Error: API could not answer your get request.");
    }
  };
  $.ajax(settings);

}

// populate form fields
function renderDetails() {
	$("#wine-title").val(wineObj.name);
	$("#wine-type").val(wineObj.type);
	$("#wine-winery").val(wineObj.winery);
	$("#wine-region").val(wineObj.region);
	$("#wine-state").val(wineObj.state);
	$("#wine-price").val(wineObj.cost);
	$("#wine-points").val(wineObj.rating);
	$("#wine-description").text(wineObj.description);
  $("#wine-comments").text(wineObj.comments);
}


$(function() {
  //if token is null, then user NOT logged in, so direct them to login
  if ((token === null) || (user === null)) {
    window.location.href = "/login.html";
  } else {
    $('body').toggleClass("hidden");
  }

	let hrefString = window.location.href;
	var getId = new Array();
	let getIdString = hrefString.split("?");
	getId = getIdString[1].split("=");

	getDetails(getId[1]);
})