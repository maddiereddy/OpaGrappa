'use strict';

let user = localStorage.getItem('user');
let token = localStorage.getItem('token');
let listData = {};
let toggleName = true;
let toggleType = true;
let toggleCost = true;


// clear out local storage before logging user out
$(".logout").click(function(e) {
	console.log('you clicked logout!');
	localStorage.clear();
	user = null;
	window.location.reload(true);
});

// sort wines in table asc/desc order by name
$("#name-header").click(function(e) {
	renderList(listData, "name", toggleName);
	toggleName = !toggleName;
});

// sort wines in table asc/desc order by type
$("#type-header").click(function(e) {
	renderList(listData, "type", toggleType);
	toggleType = !toggleType;
});

// sort wines in table asc/desc order by price
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

// Pop up window to display message that a wine was removed from the list
// Or, tell user to create a list
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

// get user list of saved wines
function getList() {
  const settings = {
    url: '/mylist',
    headers: { 'Authorization': `Bearer ${token}` },
    dataType: 'json',
    type: 'GET',
    success: function(wines) {
      if (wines.length > 0) {
      	listData = wines;
        renderList(wines, "name", toggleName);
      } else {
        let str1 = `You have no items in your list!`;
        let str2 = `Start by 'Search'-ing and adding wines from there!!`;
        displayModal(`Create a List`, str1, str2, false);
      }
    },
    error: function(data) {
      console.log("Error: API could not answer your get request.");
    }
  };
  $.ajax(settings);
}

// display user list of wines in sortable table
function renderList(wines, sort, asc) {
  let listItems = [];

	wines.sort(compareValues(sort, asc));
  listData = wines;

	wines.map(wine => {
		let hrefView = "edit-list.html?id=" + wine.id;

	  listItems.push(`<tr>
        <td><a href="${hrefView}">${wine.name}</a></td>
        <td style="text-align: center;">${wine.type}</td>
        <td style="text-align: center;">${wine.cost}</td>
        <td><button type="button" class="fa-button" id=${wine.id} aria-label="remove selected wine from list"><i class="fa fa-times" aria-hidden="true"></i></button></td>
      </tr>`);
	});

	$('.table-body').html('');
	$('.table-body').append(listItems);
}

// button for removing wine from list
$(document).on('click', 'button.fa-button', function () { 
  deleteWine(this.id);
  return false;
});

// remove wine from selected row directly from table
function deleteWine(id) {
  let toRemove = listData.find(wine => { 
    return (wine.id === id)
  });

  const settings = {
    url: `/mylist/${id}`,
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
    contentType: "application/json",
    success: function(wine) {
      let messageStr = `has been removed from your list`;
      displayModal(`Wine removed from List`, toRemove.name, messageStr, true);
    },
    error: function(data) {
      console.log("Error: API could not delete list item.");
    }
  };
  $.ajax(settings);
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