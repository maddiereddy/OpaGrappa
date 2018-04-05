let user = localStorage.getItem('user');
let token = localStorage.getItem('token');

$(".logout").click(function(e) {
	console.log('you clicked logout!');
	localStorage.clear();
	user = null;
	window.location.reload(true);
});

$(".search-list-item").click(function(e) {
	$("form").toggleClass("hidden");
})


$(function() {
	//if token is null, then user NOT logged in, so direct them to login
	if ((token === null) || (user === null)) {
		window.location.href = "/login.html";
	} else {
		$('body').toggleClass("hidden");
	}



  // $('.state-select').select2({
  // 	theme: "classic"
  // });

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