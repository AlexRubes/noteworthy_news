//event for saving article
$(document).on("click", ".status", function () {
	
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
		url: "/saved/note/" + thisId
	})
	.then(function (data) {
      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
	});
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
	// Grab the id associated with the article from the submit button
	var thisId = $(this).attr("data-id");
  
	// Run a POST request to change the note, using what's entered in the inputs
	$.ajax({
	  method: "POST",
	  url: "/saved/note/" + thisId,
	  data: {
		// Value taken from title input
		title: $("#titleinput").val(),
		// Value taken from note textarea
		body: $("#bodyinput").val()
	  }
	})
	  // With that done
	  .then(function(data) {
		// Log the response
		console.log(data);
		// Empty the notes section
		$("#results").empty();
		$("#exampleModal").hide();
	  });
  
	// Also, remove the values entered in the input and textarea for note entry
	$("#titleinput").val("");
	$("#bodyinput").val("");
  });
  

//event for closing modal
$(document).on("click", "#close", function () {
	$("#exampleModal").hide();
});

