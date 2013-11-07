var Ship = (function() {
	var shipInformation = {
		rotation: new THREE.Vector3(Math.PI / 2,Math.PI / 2,Math.PI / 2),
		position: new THREE.Vector3(),
		health: 100.0,
		shields: {
			fore: 100,
			aft: 100,
		},
		zVelocity: new THREE.Vector3(),
		yVelocity: new THREE.Vector3()
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
		this.warningStrings = {
			booster: {
				fore: "",
				aft: "",
				starboard_vertical: "",
				starboard_horizontal: "",
				port_vertical: "",
				port_horizontal: ""
			},
			health: ""
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
			"Millenium Falcon",
			"Chaos Kitten"
		];
		this.designation = designations[Math.floor(Math.random() * designations.length)];

		this.customFunctions = [];
	}
	// a few helpful functions for extracting information about the ship
	Ship.prototype.getRotation = function() {
		return shipInformation.rotation;
	}
	Ship.prototype.getPosition = function() {
		return {
			x: shipInformation.position.x,
			y: shipInformation.position.y,
			z: shipInformation.position.z
		};
	}
	Ship.prototype.getVelocity = function() {
		// WARNING: this exposes an exploit.  FIX LATER!!!
		return {
			z: shipInformation.zVelocity,
			y: shipInformation.yVelocity
		};
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
					ship.warningStrings.booster[booster] = "Overpowered";
					// once per second, diminish health
					if(frameNumber % 30 == 0) shipInformation.health -= (ship.boosters[booster] - 1.0);
				}
			}
		}
		if(ship.getHealth() <= 30) {
			ship.warningStrings.health = "low";
		} else if(ship.getHealth() <= 10) {
			ship.warningStrings.health = "critical!";
		} else {
			ship.warningStrings.health = "";
		}

		stardate = (new Date().getTime()) / 1000;

		var pitch = shipInformation.rotation.x + (ship.boosters.fore - ship.boosters.aft)/100;
		if(pitch > Math.PI) {
			shipInformation.rotation.x = -(Math.PI * 2) + pitch;
		} else if(pitch < -Math.PI) {
			shipInformation.rotation.x = (Math.PI * 2) - pitch;
		} else {
			shipInformation.rotation.x = pitch;
		}
		var yaw = shipInformation.rotation.y + (ship.boosters.starboard_horizontal - ship.boosters.port_horizontal)/100;
		if(yaw > Math.PI) {
			shipInformation.rotation.y = -(Math.PI * 2) + yaw;
		} else if(yaw < -Math.PI) {
			shipInformation.rotation.y = (Math.PI * 2) - yaw;
		} else {
			shipInformation.rotation.y = yaw;
		}
		var roll = shipInformation.rotation.z + (ship.boosters.starboard_vertical - ship.boosters.port_vertical)/100;
		if(roll > Math.PI) {
			shipInformation.rotation.z = -(Math.PI * 2) + roll;
		} else if(roll < -Math.PI) {
			shipInformation.rotation.z = (Math.PI * 2) - roll;
		} else {
			shipInformation.rotation.z = roll;
		}
		// update velocities
		shipInformation.zVelocity.z = (ship.boosters.port_horizontal + ship.boosters.starboard_horizontal);
		shipInformation.yVelocity.y = (ship.boosters.port_vertical + ship.boosters.starboard_vertical + ship.boosters.fore + ship.boosters.aft) / 100;

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
	Ship.prototype.setPosition = function(pos) {
		shipInformation.position = pos;
	}
	return Ship;
})();