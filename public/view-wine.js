'use strict';

let user = localStorage.getItem('user');
let token = localStorage.getItem('token');

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
      renderDetails(wine);
    },
    error: function(data) {
      console.log("Error: API could not answer your get request.");
    }
  };
  $.ajax(settings);

}

function renderDetails(wine) {

	$("#wine-title").val(wine.name);
	$("#wine-type").val(wine.type);
	$("#wine-winery").val(wine.winery);
	$("#wine-region").val(wine.region);
	$("#wine-state").val(wine.state);
	$("#wine-price").val(wine.cost);
	$("#wine-points").val(wine.rating);
	$("#wine-description").text(wine.description);
}

$(function() {
	let hrefString = window.location.href;
	var getId = new Array();
	let getIdString = hrefString.split("?");
	getId = getIdString[1].split("=");

	getDetails(getId[1]);
})