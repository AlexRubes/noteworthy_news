$(document).on("click", ".status", function () {
	var status = $(this).attr("value");
	if (status === "Saved") {
		$(this).html("Unsave");
	};
});