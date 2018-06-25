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
	//show modal
	var modal = document.getElementById('exampleModal');
	modal.style.display = "block";
	var thisId = $(this).attr("value");
	//ajax to get all articles
	$.ajax({
		method: "GET",
		url: "/notes/" + thisId
	})
	.then(function (data) {
		if (data.note) {
			// Place the body of the note in the body textarea
			$(".modal-body").val(data.note.body);
		  }
	});

});


//event for adding note
$(document).on("click", ".addnote-button", function () {
	alert($(this).attr("value"));
	var thisId = $(this).attr("value");
});
//event for saving notes

//event for removing notes

