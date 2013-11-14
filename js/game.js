(function() {
	function Game(renderer,hud,console,audio) {
		this.victory = false;
		this.frameNumber = 0;
		this.lastFrame = Date.now();
		this.timeDelta = 0;
		this.ship = new Ship();
		this.renderer = renderer;
		this.hud = hud;
		this.console = console;
		this.audio = audio;
		this.functions = [];
		this.version = "0.2.1";
	}
	Game.prototype.run = function() {
		this.tick();
		this.console.repl();
	}
	Game.prototype.tick = function() {
		// sanity checks
		if(!this.ship) {
			throw new Error("No ship object to work with!");
		}
		// game over checks
		if(endGameConditionCheck(this.ship)) {
			if(!this.victory)
				$("#gameover").show();
			return; // game over
		} else {
			requestAnimationFrame(this.tick.bind(this));
		}

		updateBoosters(this.ship);
		updateStructuralIntegrityFields(this.ship);
		updateRotation(this.ship);
		updateVelocities(this.ship);
		this.updateCannons();

		this.runCustomFunctions();
		this.updateVariables();
		// do animation updates after logic updates
		this.renderer.render(this.frameNumber,this.timeDelta,this.ship);
		this.hud.render(this.frameNumber,this.timeDelta,this.ship);
		// finally do audio updates last of all, because sound travels slower than light ;)
		this.audio.update(this.frameNumber,this.timeDelta,this.ship);
	}

	Game.prototype.addFunction = function(f) {
		this.functions.push(f);
	}

	Game.prototype.runCustomFunctions = function() {
		var self = this;
		this.functions.forEach(function(f) {
			if(f.apply(self)) {
				self.functions.splice(f,1);
			}
		});
	}

	Game.prototype.updateVariables = function() {
		this.frameNumber++;
		this.timeDelta = Date.now() - this.lastFrame;
		this.lastFrame = Date.now();
		this.stardate = (new Date().getTime()) / 1000;
	}

	function endGameConditionCheck(ship) {
		// thus far there's only one condition which can end the game
		return (ship.health <= 0.0);
	}
	function updateBoosters(ship) {
		ship.boosters.forEach(function(booster) {
			if(booster.power > 1.0) {
				booster.warning = "Overpowered";
				// reduce health by the overpower amount once per second
				if(this.frameNumber % 30 == 0) shipInformation.health -= (booster.power - 1.0);
			} else if(booster.power < 0.0) {
				ship.warn("Nice try, buddy, but I fixed that!");
				booster.warning = "";
				booster.power = 0;
			} else {
				booster.warning = "";
			}
		});
	}
	function updateStructuralIntegrityFields(ship) {
		if(ship.health <= 30) {
			ship.health.warning = "low";
		} else if(ship.health <= 10) {
			ship.health.warning = "critical!";
		} else {
			ship.health.warning = "";
		}
	}
	function updateRotation(ship) {
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
	}

	function updateVelocities(ship) {
		var zBoosters = ship.boosters.reduce(function(powerSum,booster) {
			return powerSum + ((booster.orientation == "horizontal") ? +booster.power : 0);
		},0);
		var yBoosters = ship.boosters.reduce(function(powerSum,booster) {
			return powerSum + ((booster.orientation == "vertical") ? +booster.power : 0);
		},0);
		ship.location.velocity.z = -(zBoosters/100);
		ship.location.velocity.y = yBoosters/100;
	}

	Game.prototype.updateCannons = function() {
		var self = this;
		function updateCannon(cannon) {
			if(Math.abs(cannon.rotationDelta.y) > Math.PI / 64) {
				cannon.rotation.y += (cannon.rotationDelta.y / Math.abs(cannon.rotationDelta.y)) * (Math.PI / 64);
				cannon.rotationDelta.y -= (cannon.rotationDelta.y / Math.abs(cannon.rotationDelta.y)) * (Math.PI / 64);
			} else {
				cannon.rotation.y += cannon.rotationDelta.y;
				cannon.rotationDelta.y = 0;
			}
			if(Math.abs(cannon.rotationDelta.x) > Math.PI / 64) {
				cannon.rotation.x += (cannon.rotationDelta.x / Math.abs(cannon.rotationDelta.x)) * (Math.PI / 64);
				cannon.rotationDelta.x -= (cannon.rotationDelta.x / Math.abs(cannon.rotationDelta.x)) * (Math.PI / 64);
			} else {
				cannon.rotation.x += cannon.rotationDelta.x;
				cannon.rotationDelta.x = 0;
			}
			if(cannon.power > 0) {
				self.renderer.fireBullet(cannon);
				self.audio.playSound('bullet');
				cannon.power = 0;
			}
		}
		updateCannon(this.ship.cannons.fore);
		updateCannon(this.ship.cannons.aft);
	}

	Game.prototype.spawnTargetDrone = function() {
	    // add a target drone
	    var DRONE_SIZE = 50;
	    var droneGeom = new THREE.SphereGeometry(DRONE_SIZE,32,32);
	    var droneMat = new THREE.MeshBasicMaterial({
	            color:0xFF0000
	    });
	    var camera = this.renderer.camera;
	    drone = new THREE.Mesh(droneGeom,droneMat);
	    drone.position.getPositionFromMatrix(camera.matrix);
	    drone.rotation.setFromRotationMatrix(camera.matrix);
	    drone.translateZ(-50);
	    drone.isDrone = true; // I know it looks weird, but this is a quick way to differentiate between drones and bullets in the OctTree
	    drone.isAlive = true;
	    drone.xDir = 1;
	    this.renderer.scene.add(drone);
	    this.renderer.drones.push(drone);
	    this.renderer.tree.insert(drone);
	    this.functions.push((function(d) {
	    	return function() {
	            if(camera.position.distanceTo(d.position) < 500) {
	                    d.translateZ(-5);
	            } else {
	                    d.yTranslate = Math.sin(this.frameNumber/20) * this.timeDelta * 0.1;
	                    d.xTranslate = Math.cos(d.yTranslate) * d.xDir * 3;
	                    if(Math.random() < 0.1) {
	                            d.xDir = -d.xDir;
	                    }
	                    d.translateY(d.yTranslate);
	                    d.translateX(d.xTranslate);
	            }
	            return !d.isAlive;
	        }
	    })(drone));
	}
	Game.prototype.guide = function(target) {
		var helpText = [];
		$("#guide ul").each(function() {
			$(this).children().each(function() {
				helpText[$(this).find(".command").html()] = $(this).find(".description").html();
			});
		});
		switch(target) {
			case 'console':
				for(command in helpText) {
					if(helpText.hasOwnProperty(command)) {
						this.console.showHelp(command,helpText[command]);
					}
				}
			break;
			case 'modal':
				$("#guide").dialog({
					width: "70vw"
				});
			break;
		}
	}
	window.Game = Game;
})();