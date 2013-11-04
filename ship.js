var Ship = (function() {
	var shipInformation = {
		rotation: {
			heading: 0,
			pitch: 0,
			roll: 0
		},
		position: { 
			x: 0, 
			y: 0,
			z: 0 
		},
		health: 100,
		shields: {
			fore: 100,
			aft: 100,
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
		this.help = "There are six boosters in the 'booster' object.  Try: ship.boosters.fore = 0.01.  Try a value over 0.01 to see what happens!";
		
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
	}
	// a few helpful functions for extracting information about the ship
	Ship.prototype.getRotation = function() {
		return {
			heading: shipInformation.rotation.heading,
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
	Ship.prototype.getHealth = function() {
		return shipInformation.health;
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
		var ship = this;
		requestAnimationFrame(ship.tick.bind(ship));

		frameNumber++;

		// draw booster warning button
		var boosterContext = $("#booster")[0].getContext('2d');
		boosterContext.drawImage(
			$("#spritesheet")[0],
			(ship.warnings.booster && frameNumber % 12 < 6 ? 64 : 0), // sprite X
			0, // sprite Y
			64, // sprite W
			24, // sprite H
			0, // target X
			0, // target Y
			64, // target W
			24 // target H
		);

		// draw roll indicator
		var rollContext = $("#roll")[0].getContext('2d');
		rollContext.drawImage($("#spritesheet")[0],0,24,64,64,0,0,64,64);
		rollContext.save();
		rollContext.translate(32,32);
		rollContext.rotate(shipInformation.rotation.roll);
		rollContext.translate(-32,-32);
		rollContext.drawImage($("#spritesheet")[0],128,0,56,56,4,4,56,56);
		rollContext.restore();

		// draw pitch indicator
		var pitchContext = $("#pitch")[0].getContext('2d');
		pitchContext.drawImage($("#spritesheet")[0],64,24,64,64,0,0,64,64);
		var pitchDegrees = shipInformation.rotation.pitch * (180 / Math.PI);
		var pitchPointerLocation = 29 + ((pitchDegrees / 180) * 20);
		pitchContext.drawImage($("#spritesheet")[0],128,56,5,5,30,pitchPointerLocation,5,5);

		// logic updates
		var boosterWarning = false;
		ship.resetWarnings();
		for(booster in ship.boosters) {
			if(ship.boosters.hasOwnProperty(booster) && ship.boosters[booster] > 0.01) {
				ship.warnings.booster = true;
				ship.warningStrings.booster[booster] = "Overpowered";
				ship.health -= (booster - 0.01);
			}
		}

		var pitch = shipInformation.rotation.pitch + ship.boosters.aft - ship.boosters.fore;
		if(pitch > Math.PI) {
			shipInformation.rotation.pitch = -(Math.PI * 2) + pitch;
		} else if(pitch < -Math.PI) {
			shipInformation.rotation.pitch = (Math.PI * 2) - pitch;
		} else {
			shipInformation.rotation.pitch = pitch;
		}
		var yaw = shipInformation.rotation.yaw + ship.boosters.port_horizontal - ship.boosters.starboard_horizontal;
		if(yaw > Math.PI) {
			shipInformation.rotation.yaw = -(Math.PI * 2) + yaw;
		} else if(yaw < -Math.PI) {
			shipInformation.rotation.yaw = (Math.PI * 2) - yaw;
		} else {
			shipInformation.rotation.yaw = yaw;
		}
		var roll = shipInformation.rotation.roll + ship.boosters.port_vertical - ship.boosters.starboard_vertical;
		if(roll > Math.PI) {
			shipInformation.rotation.roll = -(Math.PI * 2) + roll;
		} else if(roll < -Math.PI) {
			shipInformation.rotation.roll = (Math.PI * 2) - roll;
		} else {
			shipInformation.rotation.roll = roll;
		}
	}
	Ship.prototype.run = function() {
		this.tick();
	}
	return Ship;
})();