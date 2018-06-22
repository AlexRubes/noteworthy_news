$(document).on("click", ".status", function () {
	alert($(this).attr("value"));
	var thisId = $(this).attr("value");
	// Run a POST request to change the status of the article
	$.ajax({
		type: "POST",
		url: "/saved/" + thisId,
		success: function () {
			res.redirect("/saved");
		}
	});
});

$(document).on("click", ".addnote-button", function () {
	alert($(this).attr("value"));
	var thisId = $(this).attr("value");

});