let user = localStorage.getItem('user');
let token = localStorage.getItem('token');
let listData = {};
let toggleName = true;
let toggleType = true;
let toggleCost = true;


// logout after clearing local storage and back to index page
$(".logout").click(function(e) {
	console.log('you clicked logout!');
	localStorage.clear();
	user = null;
	window.location.reload(true);
});


//get all states in wines table from server
function getStates() {
  const settings = {
    url: '/wines/states',
    headers: { 'Authorization': `Bearer ${token}` },
    dataType: 'json',
    type: 'GET',
    success: function(states) {
      renderStates(states);
    },
    error: function(data) {
      console.log("Error: API could not answer your get request.");
    }
  };
  $.ajax(settings);
}


// display all states in the dropdown box
function renderStates(states) {
  let listItems = [];

	states.map(state => {
	  listItems.push(`<option value="${state}">${state}</option>`);
	});
  
	$('.state-select').append(listItems);

  // get state from local storage to set previous selection
  if (localStorage.getItem('state') !== null)
    $(`.state-select option[value="${localStorage.getItem('state')}"]`).attr('selected','selected');
}


// store state selected by user and call function to get all regions for given state
$('.state-select').change(function() {
	var state = $('.state-select option:selected').text();

  localStorage.setItem('state', state);
	getRegions(state);
});


// get all regions for a given state from server
function getRegions(state) {
  const settings = {
    url: `/wines/regions/${state}`,
    headers: { 'Authorization': `Bearer ${token}` },
    dataType: 'json',
    type: 'GET',
    success: function(regions) {
      renderRegions(regions);
    },
    error: function(data) {
      console.log("Error: API could not answer your get request.");
    }
  };
  $.ajax(settings);
}


// display regions in dropdown box
function renderRegions(regions) {
  let listItems = [];

	regions.map(region => {
	  listItems.push(`<option value="${region}">${region}</option>`);
	});

	$('.region-select').html('');
	$('.region-select').append('<option value="0">Select region:</option>');
	$('.region-select').append(listItems);

  // get region from local storage to set previous selection
  if (localStorage.getItem('region') !== null)
    $(`.region-select option[value="${localStorage.getItem('region')}"]`).attr('selected','selected');
}


// store region selected by user and call function to get all wineries for given region
$('.region-select').change(function() {
	var region = $('.region-select option:selected').text();

  localStorage.setItem('region', region);
	getWineries(region);
});


// get all wineries for a given region from server
function getWineries(region) {
  const settings = {
    url: `/wines/wineries/${region}`,
    headers: { 'Authorization': `Bearer ${token}` },
    dataType: 'json',
    type: 'GET',
    success: function(wineries) {
      renderWineries(wineries);
    },
    error: function(data) {
      console.log("Error: API could not answer your get request.");
    }
  };
  $.ajax(settings);
}


// display wineries in dropdown box
function renderWineries(wineries) {
  let listItems = [];

	wineries.map(winery => {
	  listItems.push(`<option value="${winery}">${winery}</option>`);
	});

	$('.winery-select').html('');
	$('.winery-select').append('<option value="0">Select vineyard/winery:</option>');
	$('.winery-select').append(listItems);

  // get winery from local storage to set previous selection
  if (localStorage.getItem('winery') !== null)
    $(`.winery-select option[value="${localStorage.getItem('winery')}"]`).attr('selected','selected');
}


// store winery selected by user and call function to get all wines for given winery
$('.winery-select').change(function() {
	var winery = $('.winery-select option:selected').text();

  localStorage.setItem('winery', winery);
	getWines(winery);
});


// get all wines for selected winery from server
function getWines(winery) {
  const settings = {
    url: `/wines/list/${winery}`,
    headers: { 'Authorization': `Bearer ${token}` },
    dataType: 'json',
    type: 'GET',
    success: function(wines) {
      listData = wines;
      renderWines(wines, "name", toggleName);
    },
    error: function(data) {
      console.log("Error: API could not answer your get request.");
    }
  };
  $.ajax(settings);
}


// display wines in a table, sorted asc or desc depending on user selection (clicking on header)
function renderWines(wines, sort, asc) {
  let listItems = [];

  wines.sort(compareValues(sort, asc));
  listData = wines;

	wines.map(wine => {
		let hrefView = "view-wine.html?id=" + wine.wineId;

	  listItems.push( `<tr>
      <td><a href="${hrefView}">${wine.name}</a></td>
      <td>${wine.type}</td>
      <td>${wine.cost}</td>
      <td><button type="button" class="fa-button" id=${wine.wineId} aria-label="add selection"><i class="fa fa-plus" aria-hidden="true"></i></button></td>
    </tr>`);
	});

	$('.table-body').html('');
	$('.table-body').append(listItems);
}


// automatically add a wine to user list
$(document).on('click', 'button.fa-button', function () { 
  addWine(this.id);
  return false;
});


// add wine from table with comment field empty
function addWine(id){
  const getWine = {
    url: `/wines/${id}`,
    headers: { 'Authorization': `Bearer ${token}` },
    contentType: '"application/json"',
    type: 'GET',
    success: function(wine) {
      listData = wine;
      listData.comments = "";
      listData.userId = user; 

      const settings = {
        url: '/mylist',
        headers: { 'Authorization': `Bearer ${token}` },
        data: JSON.stringify(listData),
        method: 'POST',
        contentType: "application/json",
        success: function(newWine) {
          //if selected wine already exists on user list
          alert(`Wine: ${newWine.name} has been added to your list`);
        },
        error: function(data) {
          if (data.responseJSON.code === 422) 
            alert(`Wine: ${wine.name}. ${data.responseJSON.message}`)
          console.log("Error: API could not create a new list item.");
        }
      };
      $.ajax(settings);
    },
    error: function(data) {
      console.log("Error: API could not answer your get request.");
    }
  };

  $.ajax(getWine);
}

// get 20 wines by default when page first loaded up
function getDefaultList() {
  const settings = {
    url: '/wines',
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

// display these 20 wines
function renderList(wines, sort, asc) {
  let listItems = [];

  wines.sort(compareValues(sort, asc));
  listData = wines;

  wines.map(wine => {
    let hrefView = "view-wine.html?id=" + wine.wineId;

    listItems.push(`<tr>
      <td><a href="${hrefView}">${wine.name}</a></td>
      <td>${wine.type}</td>
      <td>${wine.cost}</td>
      <td><button type="button" class="fa-button" id=${wine.wineId} aria-label="add selection"><i class="fa fa-plus" aria-hidden="true"></i></button></td>
    </tr>`);
  });

  $('.table-body').html('');
  $('.table-body').append(listItems);
}

// sort wines in table asc/desc order by name
$("#name-header").click(function(e) {
  renderWines(listData, "name", toggleName);
  toggleName = !toggleName;
});

// sort wines in table asc/desc order by type
$("#type-header").click(function(e) {
  renderWines(listData, "type", toggleType);
  toggleType = !toggleType;
});

// sort wines in table asc/desc order by price
$("#cost-header").click(function(e) {
  renderWines(listData, "cost", toggleCost);
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


$(function() {
	//if token is null, then user NOT logged in, so direct them to login
	if ((token === null) || (user === null)) {
		window.location.href = "/login.html";
	} else {
		$('body').toggleClass("hidden");
	}

  getStates();

  // if first time opening page with no pre-selections
  if ((localStorage.getItem('state') === null) && (localStorage.getItem('region') === null) && (localStorage.getItem('winery') === null)) {
    getDefaultList();  
  } else {
    getRegions(localStorage.getItem('state'));
    getWineries(localStorage.getItem('region'));
    getWines(localStorage.getItem('winery'));
  }
    
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