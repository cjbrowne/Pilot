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

function resetOrientation() {
	function resetPitch() {
		var shipRot = ship.getAbsoluteRotation();
		ship.boosters.aft = Math.max(0,Math.min(1.0,shipRot.x*100));
		ship.boosters.fore = Math.max(0,Math.min(1.0,-shipRot.x*100));
		return (shipRot.x == 0);
	}
	function resetYaw() {
		var shipRot = ship.getAbsoluteRotation();
		ship.boosters.port_horizontal = Math.max(0,Math.min(1.0,shipRot.y*100));
		ship.boosters.starboard_horizontal = Math.max(0,Math.min(1.0,-shipRot.y*100));
		return (shipRot.y == 0);
	}
	function resetRoll() {
		var shipRot = ship.getAbsoluteRotation();
		ship.boosters.port_vertical = Math.max(0,Math.min(1.0,shipRot.z*100));
		ship.boosters.starboard_vertical = Math.max(0,Math.min(1.0,-shipRot.z*100));
		return (shipRot.z == 0);
	}
	ship.customFunctions.push(resetPitch);
	ship.customFunctions.push(resetYaw);
	ship.customFunctions.push(resetRoll);
}

function go(amount) {
	ship.boosters.starboard_horizontal =
	ship.boosters.port_horizontal =
	amount;
}