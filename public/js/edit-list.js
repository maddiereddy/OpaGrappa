'use strict';

let user = localStorage.getItem('user');
let token = localStorage.getItem('token');
let wineObj = {};

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
      window.location.reload(true);
    },
    error: function(data) {
      console.log("Error: API could not update list item.");
    }
  };
  $.ajax(settings);
})

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

$("#back-button").click(function() {
	window.history.back();
});

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