//event for saving article
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

//event for unsaving article 
$(document).on("click", ".delete", function () {
	alert($(this).attr("value"));
	var thisId = $(this).attr("value");
	// Run a POST request to change the status of the article
	$.ajax({
		type: "POST",
		url: "/unsave/" + thisId,
		success: function () {
			res.redirect("/saved");
		}
	});
});

//event for popping up modal and seeing notes
$(document).on("click", ".seenotes", function () {
	alert("clicked!");
	var modal = document.getElementById('exampleModal');
	modal.style.display = "block";
	// var thisId = $(this).attr("value");
	// $.ajax({
	// 	method: "GET",
	// 	url: "/notes/" + thisId
	// })
	// .then(function (data) {

	// });

});

//event for removing notes

//event for adding note
$(document).on("click", ".addnote-button", function () {
	alert($(this).attr("value"));
	var thisId = $(this).attr("value");
	

});

