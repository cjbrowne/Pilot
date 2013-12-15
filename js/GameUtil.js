define("GameUtil",[],function() {
	var GameUtil = {
		endGameConditionCheck: function(ship) {
			// thus far there's only one condition which can end the game
			return (ship.health <= 0.0);
		},
		updateBoosters: function(ship,frameNumber) {
			ship.boosters.forEach(function(booster) {
				if(booster.power > 1.0) {
					booster.warning = "Overpowered";
					// reduce health by the overpower amount once per second
					if(frameNumber % 30 == 0) shipInformation.health -= (booster.power - 1.0);
				} else if(booster.power < 0.0) {
					ship.warn("Nice try, buddy, but I fixed that!");
					booster.warning = "";
					booster.power = 0;
				} else {
					booster.warning = "";
				}
			});
		},
		updateStructuralIntegrityFields: function(ship) {
			if(ship.health <= 30) {
				ship.health.warning = "low";
			} else if(ship.health <= 10) {
				ship.health.warning = "critical!";
			} else {
				ship.health.warning = "";
			}
		},
		updateRotation: function(ship) {
			// relative rotation since last frame
			// alias the rotation delta because otherwise my fingers will start to hurt very soon
			var deltaRot = ship.location.rotationDelta;
			var pitch = (ship.boostersByName["fore vertical"] - ship.boostersByName["aft vertical"]) / 100;
			if(pitch > Math.PI) {
				deltaRot.x = -(Math.PI * 2) + pitch;
			} else if(pitch < -Math.PI) {
				deltaRot.x = (Math.PI * 2) - pitch;
			} else {
				deltaRot.x = pitch;
			}
			var yaw = (ship.boostersByName["starboard horizontal"] - ship.boostersByName["port horizontal"])/100;
			if(yaw > Math.PI) {
				deltaRot.y = -(Math.PI * 2) + yaw;
			} else if(yaw < -Math.PI) {
				deltaRot.y = (Math.PI * 2) - yaw;
			} else {
				deltaRot.y = yaw;
			}
			var roll = (ship.boostersByName["starboard vertical"] - ship.boostersByName["port vertical"])/100;
			if(roll > Math.PI) {
				deltaRot.z = -(Math.PI * 2) + roll;
			} else if(roll < -Math.PI) {
				deltaRot.z = (Math.PI * 2) - roll;
			} else {
				deltaRot.z = roll;
			}

			// absolute rotation
			var absRot = new THREE.Euler();
			absRot.x = ship.location.rotation.x + deltaRot.x;
			absRot.y = ship.location.rotation.y + deltaRot.y;
			absRot.z = ship.location.rotation.z + deltaRot.z;
			if(absRot.x > Math.PI) {
				ship.location.rotation.x = -(Math.PI * 2) + absRot.x;
			} else if(absRot.x < -Math.PI) {
				ship.location.rotation.x = (Math.PI * 2) - absRot.x;
			} else {
				ship.location.rotation.x = absRot.x;
			}
			if(absRot.y > Math.PI) {
				ship.location.rotation.y = -(Math.PI * 2) + absRot.y;
			} else if(absRot.y < -Math.PI) {
				ship.location.rotation.y = (Math.PI * 2) - absRot.y;
			} else {
				ship.location.rotation.y = absRot.y;
			}
			if(absRot.z > Math.PI) {
				ship.location.rotation.z = -(Math.PI * 2) + absRot.z;
			} else if(absRot.z < -Math.PI) {
				ship.location.rotation.z = (Math.PI * 2) - absRot.z;
			} else {
				ship.location.rotation.z = absRot.z;
			}
		},
		updateVelocities: function(ship) {
			var zBoosters = ship.boosters.reduce(function(powerSum,booster) {
				return powerSum + ((booster.orientation == "horizontal") ? +booster.power : 0);
			},0);
			var yBoosters = ship.boosters.reduce(function(powerSum,booster) {
				return powerSum + ((booster.orientation == "vertical") ? +booster.power : 0);
			},0);
			ship.location.velocity.z = -(zBoosters/100);
			ship.location.velocity.y = yBoosters/100;
		}
	}
	return GameUtil;
});