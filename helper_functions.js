function print(string) {
	$("#output").append(string + "<br />");
}

Function.prototype.help = function() {
	switch(this.name) {
		case "editor":
			print("A small, extremely lightweight text editing application.  Useful for defining functions.");
			break;
		case "allStop":
			print("Brings the ship to a complete stop by resetting all engines to zero.");
			break;
		default:
			print("This function has no help text associated with it, sorry.");
			break;
	}
}

function editor() {
	$("#prompt").hide();
	$("#output").hide();
	$("#PS1").hide();
	$("#editor").show();
	$("#editor_body").focus();
}

function allStop() {
	ship.boosters.fore					=
	ship.boosters.aft 					=
	ship.boosters.starboard_vertical	=
	ship.boosters.starboard_horizontal	=
	ship.boosters.port_vertical			=
	ship.boosters.port_horizontal		=
	0;
}