'use strict';

$("#back-button").click(function() {
	window.history.back();
});

$(function() {
	$('#wine-title').val("Sweet Cheeks 2012 Vintner's Reserve Wild Child Block Pinot Noir (Willamette Valley)");
	$("#wine-designation").val("Vintner's Reserve Wild Child Block");
	$("#wine-type").val("Pinot Noir");
	$("#wine-winery").val("Sweet Cheeks");
	$("#wine-region").val("Willamette Valley");
	$("#wine-price").val("$65");
	$("#wine-points").val("87 pts");
	$("#wine-description").text("Much like the regular bottling from 2012, this comes across as rather rough and tannic, with rustic, earthy, herbal characteristics. Nonetheless, if you think of it as a pleasantly unfussy country wine, it's a good companion to a hearty winter stew.");
})