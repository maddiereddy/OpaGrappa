'use strict';

let user = localStorage.getItem('user');
let token = localStorage.getItem('token');
let wineObj = {};

// add selected wine to user list
$('.wine-details-section').submit(function(event) {
	event.preventDefault();

  wineObj.comments = $("#wine-comments").val();
  wineObj.userId = user; 

  const settings = {
    url: '/mylist',
    headers: { 'Authorization': `Bearer ${token}` },
    data: JSON.stringify(wineObj),
    method: 'POST',
    contentType: "application/json",
    success: function(wine) {
      window.location.href = 'my-list.html';
    },
    error: function(data) {
      console.log("Error: API could not create a new list item.");
    }
  };
  $.ajax(settings);
})

// go back
$("#back-button").click(function() {
	window.history.back();
});

// get details of selected wine
function getDetails(wineId) {
	const settings = {
    url: `/wines/${wineId}`,
    headers: { 'Authorization': `Bearer ${token}` },
    contentType: '"application/json"',
    type: 'GET',
    success: function(wine) {
    	wineObj = wine;
    	wineObj.wineId = wineId;

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