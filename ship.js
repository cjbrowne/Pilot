var Ship = (function() {
	var shipInformation = {
		rotation: new THREE.Euler(),
		position: new THREE.Vector3(),
		absRot: new THREE.Euler(),
		health: 100.0,
		shields: {
			fore: 100,
			aft: 100,
		},
		velocity: new THREE.Vector3(),
		foreCannon: {
			rotation: {
				pitch: 0,
				yaw: 0
			},
			power: 0
		}
	}
	var Ship = function() {
		this.Cannon = function() {
			this.rotation = { pitch: 0, yaw: 0 };
			this.power = 0;
		}
		this.Cannon.prototype.yaw = function(amount) {
			this.rotation.yaw += amount;
		}
		this.Cannon.prototype.setYaw = function(to) {
			this.rotation.yaw = to;
		}
		this.Cannon.prototype.pitch = function(amount) {
			this.rotation.pitch += amount;
		}
		this.Cannon.prototype.setPitch = function(to) {
			this.rotation.pitch = to;
		}
		this.Cannon.prototype.fire = function(power) {
			this.power = power || 1;
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
		var absRot = new THREE.Euler();
		absRot.x = shipInformation.absRot.x + shipInformation.rotation.x;
		absRot.y = shipInformation.absRot.y + shipInformation.rotation.y;
		absRot.z = shipInformation.absRot.z + shipInformation.rotation.z;

		if(absRot.x > Math.PI) {
			shipInformation.absRot.x = -(Math.PI * 2) + absRot.x;
		} else if(absRot.x < -Math.PI) {
			shipInformation.absRot.x = (Math.PI * 2) - absRot.x;
		} else {
			shipInformation.absRot.x = absRot.x;
		}
		if(absRot.y > Math.PI) {
			shipInformation.absRot.y = -(Math.PI * 2) + absRot.y;
		} else if(absRot.y < -Math.PI) {
			shipInformation.absRot.y = (Math.PI * 2) - absRot.y;
		} else {
			shipInformation.absRot.y = absRot.y;
		}
		if(absRot.z > Math.PI) {
			shipInformation.absRot.z = -(Math.PI * 2) + absRot.z;
		} else if(absRot.z < -Math.PI) {
			shipInformation.absRot.z = (Math.PI * 2) - absRot.z;
		} else {
			shipInformation.absRot.z = absRot.z;
		}

		// update velocities
		shipInformation.velocity.z = -((this.boosters.port_horizontal + this.boosters.starboard_horizontal) / 200);
		shipInformation.velocity.y = (this.boosters.port_vertical + this.boosters.starboard_vertical + this.boosters.fore + this.boosters.aft) / 200;

		if(Math.abs(shipInformation.foreCannon.rotation.yaw - this.foreCannon.rotation.yaw) > Math.PI / 64) {
			if(shipInformation.foreCannon.rotation.yaw > this.foreCannon.rotation.yaw) {
				shipInformation.foreCannon.rotation.yaw -= Math.PI / 64;
			} else if(shipInformation.foreCannon.rotation.yaw < this.foreCannon.rotation.yaw) {
				shipInformation.foreCannon.rotation.yaw += Math.PI / 64;
			}
		} else {
			// cheat for the last 1/32 segment of the circle because fuck you, that's why.
			shipInformation.foreCannon.rotation.yaw = this.foreCannon.rotation.yaw;
		}

		// cap foreCannon pitch at 0 - Math.PI
		this.foreCannon.rotation.pitch = Math.max(0,Math.min(this.foreCannon.rotation.pitch,Math.PI));
		if(Math.abs(shipInformation.foreCannon.rotation.pitch - this.foreCannon.rotation.pitch) > Math.PI / 64) {
			if(shipInformation.foreCannon.rotation.pitch > this.foreCannon.rotation.pitch) {
				shipInformation.foreCannon.rotation.pitch -= Math.PI / 64;
			} else if(shipInformation.foreCannon.rotation.pitch < this.foreCannon.rotation.pitch) {
				shipInformation.foreCannon.rotation.pitch += Math.PI / 64;
			}
		} else {
			// cheat for the last 1/32 segment of the circle because fuck you, that's why.
			shipInformation.foreCannon.rotation.pitch = this.foreCannon.rotation.pitch;
		}

		if(ship.foreCannon.power > 0) {
			shipInformation.foreCannon.power = ship.foreCannon.power;
			ship.foreCannon.power = 0;
		}

		this.runCustomFunctions();
	}
	Ship.prototype.clearRot = function() {
		shipInformation.rotation.set(0,0,0);
	}
	Ship.prototype.resetCannon = function() {
		shipInformation.foreCannon.power = 0;
	}
	Ship.prototype.getAbsoluteRotation = function() {
		return shipInformation.absRot.clone();
	}
	Ship.prototype.runCustomFunctions = function() {
		this.customFunctions.forEach(function(f) {
			if(f.call(ship)) {
				ship.customFunctions.splice(ship.customFunctions.indexOf(f),1);
			}
		});
	}
	Ship.prototype.getForeCannon = function() {
		return shipInformation.foreCannon;
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
		if(this.designation == "") {
			this.log("Welcome to the onboard tutorial system on the great star cruiser... oh dear.  It seems we don't have a name.  Would you mind setting ship.designation to something so we can get started?");
			this.customFunctions.push(function() {
				if(this.designation != "") {
					this.log("Interesting choice of name... well, ok.  Welcome aboard the " + this.designation + ", pilot!");
					this.log("Now, let's see, what can we teach you... oh! I know!");
					this.log("This'll be ace, you'll love this!");
					this.log("Try pitching the ship forward (nose-down) by 1 radian.");
					this.log("If you get stuck, use the helper function resetOrientation() to reset your direction.");
					this.log("I'm going to fire off that function now in case you've been fiddling about while you were reading.");
					resetOrientation(); // in case the user has been fiddling
					this.customFunctions.push(function() {
						var absRot = this.getAbsoluteRotation();
						if(absRot.x >= -1.005 &&
							absRot.x <= -0.995) {
							allStop();
							this.log("Well done!  Now, let's try going back the other way shall we?");
							this.customFunctions.push(function() {
								var absRot = this.getAbsoluteRotation();
								if(absRot.x >= -0.005 &&
									absRot.x <= 0.005) {
									allStop();
									this.tutorialPhase2();
									return true;
								} else {
									return false;
								}
							});
							return true;
						} else {
							return false;
						}
					});
					return true;
				} else {
					return false;
				}
			});	
			return "Remember to use quote-marks to surround strings!";
		} 
	}
	Ship.prototype.tutorialPhase2 = function() {
		this.log("Excellent work, pilot!  You're progressing nicely!");
		this.log("Now, I'm not going to insult your intelligence - I'm sure you can work out the yaw and roll controls for yourself.");
		this.log("Let's move onto something a bit more challenging, shall we?  Try moving the ship forward.");
		this.customFunctions.push(function() {
			if(this.boosters.starboard_horizontal == this.boosters.port_horizontal && this.boosters.port_horizontal > 0) {
				allStop();
				this.log("Unbelievable, you're crawling along at an incredible pace!  Well done!");
				this.log("Damn if those boosters aren't the slowest thing in the universe though, huh?");
				this.log("Maybe some day I'll get an upgrade...");
				this.log("I digress.  Back to the subject at hand: you can also power yourself vertically, but we'll skip that part of the tutorial.");
				this.log("Oh, you wanted to do that part?  Too bad.  I can't be bothered.  I want to get to the fun stuff!  Guns!");
				this.tutorialPhase3();
				return true;
			} else {
				return false;
			}
		});
	}
	Ship.prototype.tutorialPhase3 = function() {
		this.log("Unfortunately, I haven't been programmed for gun controls yet.  Damn and blast!");
	}
	return Ship;
})();