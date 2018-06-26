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

	var modal = document.getElementById('exampleModal');
	modal.style.display = "block";
	var articleId = $(this).data('id');
	$.ajax({
		method: 'GET',
		url: "/saved/notes/" + articleId
	})
		.then(function (data) {
			$('.modal-content').html(`
                <div class="modal-header">
                    <h5 class="modal-title">${data.title}</h5>
                    <button type="button" id="close-modal" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <ul class="list-group"></ul>
                    <textarea name="note" class="note-content"></textarea>
                </div>
				<div class="modal-footer">
				<form action="/saved/notes/${data._id}" method="POST">
                    <button type="button" data-id="${data._id}" class="btn btn-primary savenote">Save Note</button>
                    <button type="button" id="close-modal" class="btn btn-secondary" data-dismiss="modal">Close</button>
				</form>
				</div>`
			);
			let notes = data.note;
			console.log(notes);
			for ( var i = 0; i < notes.length; i++) { 
			$('.list-group').append(`<li class="list-group-item justify-content-between">${note.body}</li>`);
			};

		});
});

// When you click the savenote button
$(document).on("click", ".savenote", function () {
	// Grab the id associated with the article from the submit button

	let thisId = $(this).data('id');
	let content = $('.note-content').val().trim();
	// Run a POST request to change the note, using what's entered in the inputs
	if (content) {
		$.ajax({
			method: "POST",
			url: "/saved/notes/" + thisId,
			data: {
				// Value taken from note textarea
				body: $("#bodyinput").val()
			}
		})
			// With that done
			.then(function (data) {
				$('.note-content').val('');
			});
	}
	else {
		$('.note-content').val('');
		return;
	};
});


//event for closing modal
$(document).on("click", "#close-modal", function () {
	var modal = document.getElementById('exampleModal');
	modal.style.display = "none";
});
