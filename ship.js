var Ship = (function() {
	var shipInformation = {
		rotation: {
			yaw: 0,
			pitch: 0,
			roll: 0
		},
		position: { 
			x: 0, 
			y: 0,
			z: 0 
		},
		health: 100.0,
		shields: {
			fore: 100,
			aft: 100,
		},
		velocity: {
			x: 0.0,
			y: 0.0,
			z: 0.0
		}
	}
	var Ship = function() {
		this.Cannon = function() {
			this.rotation = { pitch: 0, yaw: 0 };
			this.power = 0;
		}
		this.Shield = function() {
			this.power = 0;
		}
		this.boosters = {
			fore: 0,
			aft: 0,
			starboard_vertical: 0,
			starboard_horizontal: 0,
			port_vertical: 0,
			port_horizontal: 0
		};
		this.warnings = {
			booster: false
		};
		this.warningStrings = {
			booster: {
				fore: "",
				aft: "",
				starboard_vertical: "",
				starboard_horizontal: "",
				port_vertical: "",
				port_horizontal: ""
			}
		};
		this.foreCannon = new this.Cannon();
		this.aftCannon = new this.Cannon();
		this.shields = {
			fore: new this.Shield(),
			aft: new this.Shield()
		};
		/*
			- For now, the ship's designation is randomly selected from a list.
			In future, it will be assigned as part of the tutorial mission.
		*/
		var designations = [
			"Enterprise",
			"Heart of Gold",
			"Miranda",
			"Pillar of Autumn",
			"Millenium Falcon"
		];
		this.designation = designations[Math.floor(Math.random() * designations.length)];

		this.customFunctions = [];
	}
	// a few helpful functions for extracting information about the ship
	Ship.prototype.getRotation = function() {
		return {
			yaw: shipInformation.rotation.yaw,
			pitch: shipInformation.rotation.pitch,
			roll: shipInformation.rotation.roll
		};
	}
	Ship.prototype.getPosition = function() {
		return {
			x: shipInformation.position.x,
			y: shipInformation.position.y,
			z: shipInformation.position.z
		};
	}
	Ship.prototype.getVelocity = function() {
		return {
			x: shipInformation.velocity.x,
			y: shipInformation.velocity.y,
			z: shipInformation.velocity.z
		}
	}
	Ship.prototype.getHealth = function() {
		return shipInformation.health;
	}
	Ship.prototype.help = function() {
		return "There are six boosters in the 'boosters' object.  Try: ship.boosters.fore = 1.0.  Try a value over 1.0 to see what happens!";
	}
	Ship.prototype.resetWarnings = function() {
		ship.warningStrings = {
			booster: {
				fore: "",
				aft: "",
				starboard_vertical: "",
				starboard_horizontal: "",
				port_vertical: "",
				port_horizontal: ""
			}
		};
		ship.warnings = {
			booster:false
		};
	}
	var frameNumber = 0;
	Ship.prototype.tick = function() {
		if(shipInformation.health <= 0.0) {
			$("#gameover").show();
			return;
		}
		var ship = this;
		requestAnimationFrame(ship.tick.bind(ship));

		frameNumber++;

		// logic updates
		var boosterWarning = false;
		ship.resetWarnings();
		for(booster in ship.boosters) {
			if(ship.boosters.hasOwnProperty(booster)) {
				if(ship.boosters[booster] > 1.0) {
					ship.warnings.booster = true;
					ship.warningStrings.booster[booster] = "Overpowered";
					// once per second, diminish health
					if(frameNumber % 30 == 0) shipInformation.health -= (ship.boosters[booster] - 1.0);
				}
			}
		}

		stardate = (new Date().getTime()) / 1000;

		var pitch = shipInformation.rotation.pitch + (ship.boosters.fore - ship.boosters.aft)/100;
		if(pitch > Math.PI) {
			shipInformation.rotation.pitch = -(Math.PI * 2) + pitch;
		} else if(pitch < -Math.PI) {
			shipInformation.rotation.pitch = (Math.PI * 2) - pitch;
		} else {
			shipInformation.rotation.pitch = pitch;
		}
		var yaw = shipInformation.rotation.yaw + (ship.boosters.starboard_horizontal - ship.boosters.port_horizontal)/100;
		if(yaw > Math.PI) {
			shipInformation.rotation.yaw = -(Math.PI * 2) + yaw;
		} else if(yaw < -Math.PI) {
			shipInformation.rotation.yaw = (Math.PI * 2) - yaw;
		} else {
			shipInformation.rotation.yaw = yaw;
		}
		var roll = shipInformation.rotation.roll + (ship.boosters.starboard_vertical - ship.boosters.port_vertical)/100;
		if(roll > Math.PI) {
			shipInformation.rotation.roll = -(Math.PI * 2) + roll;
		} else if(roll < -Math.PI) {
			shipInformation.rotation.roll = (Math.PI * 2) - roll;
		} else {
			shipInformation.rotation.roll = roll;
		}
		// update velocities
		shipInformation.velocity.z = (ship.boosters.port_horizontal + ship.boosters.starboard_horizontal) / 100;
		shipInformation.velocity.y = (ship.boosters.port_vertical + ship.boosters.starboard_vertical + ship.boosters.fore + ship.boosters.aft) / 100;
		
		// apply velocities to positional information
		shipInformation.position.y += shipInformation.velocity.y;
		shipInformation.position.z += shipInformation.velocity.z;
		this.runCustomFunctions();
	}
	Ship.prototype.runCustomFunctions = function() {
		this.customFunctions.forEach(function(f) {
			f.call(ship);
		});
	}
	Ship.prototype.run = function() {
		this.tick();
	}
	Ship.prototype.log = function(string,logClass) {
		logClass = logClass || "pilot_log";
		$("#output").append("<span class='"+logClass+"'>["+stardate+"]</span> <span class='log'>" + string + "</span><br />");
	}
	Ship.prototype.disable_audio = function() {
		audio_enabled = false;
	}
	return Ship;
})();