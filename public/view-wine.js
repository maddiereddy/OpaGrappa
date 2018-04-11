'use strict';

let user = localStorage.getItem('user');
let token = localStorage.getItem('token');
let wineObj = {};

function createNewUser(userData) {
  
}

$('.wine-details-section').submit(function(event) {
	event.preventDefault();

	console.log("here to create list item")

  wineObj.comments = $("#wine-comments").val();
  wineObj.userId = user; 

  console.log(user);

  const settings = {
    url: '/mylist',
    data: JSON.stringify(wineObj),
    method: 'POST',
    contentType: "application/json",
    success: function(wine) {
    	console.log("success");
      window.location.href = '/my-list.html';
    },
    error: function(data) {
    	console.log("error");
      console.log("Error: API could not create a new list item.");
      alert(data.responseJSON.location + " error: " + data.responseJSON.message);
    }
  };
  $.ajax(settings);
})

$("#back-button").click(function() {
	window.history.back();
});

function getDetails(wineId) {
	const settings = {
    url: `/wines/${wineId}`,
    headers: { 'Authorization': `Bearer ${token}` },
    dataType: 'json',
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
	let hrefString = window.location.href;
	var getId = new Array();
	let getIdString = hrefString.split("?");
	getId = getIdString[1].split("=");

	getDetails(getId[1]);
})