'use strict';

let user = localStorage.getItem('user');
let token = localStorage.getItem('token');
let listData = {};
let toggleName = true;
let toggleType = true;
let toggleCost = true;


$(".logout").click(function(e) {
	console.log('you clicked logout!');
	localStorage.clear();
	user = null;
	window.location.reload(true);
});

$("#name-header").click(function(e) {
	renderList(listData, "name", toggleName);
	toggleName = !toggleName;
});

$("#type-header").click(function(e) {
	renderList(listData, "type", toggleType);
	toggleType = !toggleType;
});

$("#cost-header").click(function(e) {
	renderList(listData, "cost", toggleCost);
	toggleCost = !toggleCost;
});

// function for dynamic sorting
function compareValues(key, order) {
  return function(a, b) {
    if(!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
        return 0; 
    }

    const varA = (typeof a[key] === 'string') ? 
      a[key].toUpperCase() : a[key];
    const varB = (typeof b[key] === 'string') ? 
      b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return (
      (order) ? comparison : (comparison * -1)
    );
  };
}


function getList() {
  const settings = {
    url: '/mylist',
    headers: { 'Authorization': `Bearer ${token}` },
    dataType: 'json',
    type: 'GET',
    success: function(wines) {
    	listData = wines;
      renderList(wines, "name", toggleName);
    },
    error: function(data) {
      console.log("Error: API could not answer your get request.");
    }
  };
  $.ajax(settings);
}

function renderList(wines, sort, asc) {
  let listItems = [];

	wines.sort(compareValues(sort, asc));
  listData = wines;

	wines.map(wine => {
		let hrefView = "edit-list.html?id=" + wine.id;

	  listItems.push(`<tr>
        <td><a href="${hrefView}">${wine.name}</a></td>
        <td>${wine.type}</td>
        <td>${wine.cost}</td>
        <td><a href="${hrefView}"><i class="fa fa-times" aria-hidden="true"></i></a></td>
      </tr>`);
	});

	$('.table-body').html('');
	$('.table-body').append(listItems);
}

$(function() {
	//if token is null, then user NOT logged in, so direct them to login
	if ((token === null) || (user === null)) {
		window.location.href = "/login.html";
	} else {
		$('body').toggleClass("hidden");
	}

	getList();

  // Change the selector if needed
	var $table = $('table'),
	    $bodyCells = $table.find('tbody tr:first').children(),
	    colWidth;

	// Get the tbody columns width array
	colWidth = $bodyCells.map(function() {
	  return $(this).width();
	}).get();

	// Set the width of thead columns
	$table.find('thead tr').children().each(function(i, v) {
	    $(v).width(colWidth[i]);
	});    
})