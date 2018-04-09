let user = localStorage.getItem('user');
let token = localStorage.getItem('token');
let wines = {
  states: []
}

$(".logout").click(function(e) {
	console.log('you clicked logout!');
	localStorage.clear();
	user = null;
	window.location.reload(true);
});

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

function renderStates(states) {
  var listItems = '';
	states.map(state => {
	  listItems += '<option value=' + state + '>' + state + '</option>';
	});
	$('.state-select').append(listItems);
}

$('.state-select').change(function() {
	var state = $('.state-select option:selected').text();
	getRegions(state);
});

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

function renderRegions(regions) {
  var listItems = '';

	regions.map(region => {
	  listItems += '<option value=' + region + '>' + region + '</option>';
	});

	$('.region-select').html('');
	$('.region-select').append('<option value="0">Select region:</option>');
	$('.region-select').append(listItems);
}

$('.region-select').change(function() {
	var region = $('.region-select option:selected').text();
	getWineries(region);
});

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

function renderWineries(wineries) {
  var listItems = '';

	wineries.map(winery => {
	  listItems += '<option value=' + winery + '>' + winery + '</option>';
	});

	$('.winery-select').html('');
	$('.winery-select').append('<option value="0">Select vineyard/winery:</option>');
	$('.winery-select').append(listItems);
}

$(function() {
	//if token is null, then user NOT logged in, so direct them to login
	if ((token === null) || (user === null)) {
		window.location.href = "/login.html";
	} else {
		$('body').toggleClass("hidden");
	}

	getStates();

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