var Ship = (function() {
	var shipInformation = {
		rotation: new THREE.Euler(),
		position: new THREE.Vector3(),
		health: 100.0,
		shields: {
			fore: 100,
			aft: 100,
		},
		velocity: new THREE.Vector3()
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
			I don't have the heart to delete them :'(
		var designations = [
			"Enterprise",
			"Heart of Gold",
			"Miranda",
			"Pillar of Autumn",
			"Millenium Falcon",
			"Chaos Kitten"
		];
		*/
		this.designation = "";

		this.customFunctions = [];
	}
	// a few helpful functions for extracting information about the ship
	Ship.prototype.getRotation = function() {
		return shipInformation.rotation.clone();
	}
	Ship.prototype.getPosition = function() {
		return {
			x: shipInformation.position.x,
			y: shipInformation.position.y,
			z: shipInformation.position.z
		};
	}
	Ship.prototype.getVelocity = function() {
		return shipInformation.velocity.clone();
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
				// while we're here, let's prevent the player from giving us a negative value, shall we?
				if(ship.boosters[booster] < 0) {
					ship.warn("Nice try, buddy, but I fixed that!");
					ship.boosters[booster] = 0;
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
		shipInformation.velocity.z = -((ship.boosters.port_horizontal + ship.boosters.starboard_horizontal) / 200);
		shipInformation.velocity.y = (ship.boosters.port_vertical + ship.boosters.starboard_vertical + ship.boosters.fore + ship.boosters.aft) / 200;

		this.runCustomFunctions();
	}
	Ship.prototype.clearRot = function() {
		shipInformation.rotation.set(0,0,0);
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
	Ship.prototype.warn = function(string,warningLevel) {
		warningLevel = warningLevel || 'low';
		var warningText = "WARNING";
		switch(warningLevel) {
			case 'low':
				warningText = "WARNING";
				break;
			case 'medium':
				warningText = "ALERT";
				break;
			case 'high':
				warningText = "DANGER";
				break;
			case 'critical':
				warningText = "CRITICAL";
				break;
		}
		$("#output").append("<span class='warning_" + warningLevel + "'>["+warningText+"] " + string + "</span><br />");
	}
	Ship.prototype.toggle_audio = function() {
		audio_enabled = !audio_enabled;
	}
	Ship.prototype.setPosition = function(pos) {
		shipInformation.position = pos;
	}
	Ship.prototype.tutorial = function() {
		if(ship.designation == "") {
			ship.log("Welcome to the onboard tutorial system on the great star cruiser... oh dear.  It seems we don't have a name.  Would you mind setting ship.designation to something so we can get started?");
			return "Remember to use quote-marks to surround strings!";
		} else {
			ship.log("Interesting choice of name... well, ok.  Welcome aboard the " + ship.designation + ", pilot!  Now, let's see, what can we teach you... oh! I know!  This'll be ace, you'll love this!  Try pitching the ship forward by 1 radian.  You'll need to fire a particular set of boosters for it to work!");
		}
	}
	return Ship;
})();