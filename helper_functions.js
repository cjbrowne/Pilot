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
		var shipRot = ship.getRotation();
		ship.boosters.aft = Math.max(0,Math.min(1.0,-shipRot.pitch*100));
		ship.boosters.fore = Math.max(0,Math.min(1.0,shipRot.pitch*100));
		if(shipRot.pitch == 0) {
			ship.customFunctions.splice(ship.customFunctions.indexOf(resetPitch),1);
		}
	}
	function resetYaw() {
		var shipRot = ship.getRotation();
		ship.boosters.port_horizontal = Math.max(0,Math.min(1.0,-shipRot.yaw*100));
		ship.boosters.starboard_horizontal = Math.max(0,Math.min(1.0,shipRot.yaw*100));
		if(shipRot.yaw == 0) {
			ship.customFunctions.splice(ship.customFunctions.indexOf(resetYaw),1);
		}
	}
	function resetRoll() {
		var shipRot = ship.getRotation();
		ship.boosters.port_vertical = Math.max(0,Math.min(1.0,-shipRot.roll*100));
		ship.boosters.starboard_vertical = Math.max(0,Math.min(1.0,shipRot.roll*100));
		if(shipRot.roll == 0) {
			ship.customFunctions.splice(ship.customFunctions.indexOf(resetRoll),1);
		}
	}
	ship.customFunctions.push(resetPitch);
	ship.customFunctions.push(resetYaw);
	ship.customFunctions.push(resetRoll);
}