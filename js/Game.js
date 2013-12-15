define("Game",["Ship","GameUtil"],function(Ship,GameUtil) {
	/**
		The Game class defines the game engine used to power Pilot
		@class Game
		@param {Renderer} renderer - The renderer object used as a front-end.
		@param {HUD} hud - The HUD object used for abstracting various HUD drawing operations.
		@param {Console} console - The PIL REPL used to interface with the ship.
		@param {PilotAudio} audio - An audio wrapper instance used to play sounds on cue.
	 */
	var Game = function(renderer,hud,console,audio) {
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
		this.version = "0.2.2";
		this.helpText = [];
		this.alert = "none";
		this.debug = false;
		var self = this;
		$("#guide ul").each(function() {
			$(this).children().each(function() {
				self.helpText[$(this).find(".command").text().replace(/\s/g,'')] = 
				[$(this).find(".arguments").html(),
				$(this).find(".description").html()];
			});
		});
	}
	/**
		@lends Game
	*/
	Game.prototype = {
		/**
			Starts up the PIL REPL backend and starts the main logic loop running.
			@method Game#run
		*/
		run: function() {
			this.tick();
			this.console.repl();
		},
		/**
			The main logic loop for the game.
			@method Game#tick
		*/
		tick: function() {
			// sanity checks
			if(!this.ship) {
				throw new Error("No ship object to work with!");
			}
			// game over checks
			if(GameUtil.endGameConditionCheck(this.ship)) {
				if(!this.victory)
					$("#gameover").show();
				return; // game over
			} else {
				requestAnimationFrame(this.tick.bind(this));
			}

			GameUtil.updateBoosters(this.ship);
			GameUtil.updateStructuralIntegrityFields(this.ship);
			GameUtil.updateRotation(this.ship);
			GameUtil.updateVelocities(this.ship);
			this.updateCannons();

			this.runCustomFunctions();
			this.updateVariables();
			// do animation updates after logic updates
			this.renderer.render(this.frameNumber,this.timeDelta,this.ship);
			this.hud.render(this.frameNumber,this.timeDelta,this.ship,this.alert);
			// finally do audio updates last of all, because sound travels slower than light ;)
			this.audio.update(this.frameNumber,this.timeDelta,this.ship);
		},
		/**
			Adds a custom user function to the main logic loop.
			This interface is provided to make it easy to extend the engine.
			The function passed in as a parameter should return a truthy value if the function
			should be removed from the list after executing, and falsy otherwise.  This makes
			it easy to add functions that only run for a certain duration or until a certain
			condition is met.
			@method Game#addFunction
			@param {function} the custom function to add.  Takes no arguments, exposes the Game instance as the 'this' pointer inside the function body.  Optionally returns truthy value.
		*/
		addFunction: function(f) {
			this.functions.push(f);
		},
		/**
			Runs all the custom functions that have been added to the game function immediately.
			If a function returns a truthy value, it will be automatically removed from the custom functions
			array and never run again.
			@method Game#runCustomFunctions
		*/
		runCustomFunctions: function() {
			var self = this;
			this.functions.forEach(function(f) {
				if(f.apply(self)) {
					self.functions.splice(f,1);
				}
			});
		},
		/**
			Helper function to update all the variables that need updating once per tick.
			Should not ever be called from outside the Game library, hence the recommendation for refactoring.
			@method Game#updateVariables
			@deprecated
			@todo refactor to hide from the Game object
		*/
		updateVariables: function() {
			this.frameNumber++;
			this.timeDelta = Date.now() - this.lastFrame;
			this.lastFrame = Date.now();
			this.stardate = (new Date().getTime()) / 1000;
		},
		/**
			Update the cannons.  Note that this function should not be called outside of the Game#tick function
			in its current state.
			@method Game#updateCannons
			@todo rewrite to be callable from outside the Game#tick function to force a cannon update or refactor as private.
		*/
		updateCannons: function() {
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
		},
		/**
			Causes the ship to emit a target drone which will bob about automatically until it is destroyed.
			@method Game#spawnTargetDrone
		*/
		spawnTargetDrone: function() {
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
		},
		/**
			Displays a game guide either on the console or as a jQuery-ui dialog, depending on the 'target' parameter.
			@method Game#guide
			@param {string} target - One of "console" or "modal".  Defaults to 'modal'.
		*/
		guide: function(target) {
			switch(target) {
				case 'console':
					for(command in this.helpText) {
						if(this.helpText.hasOwnProperty(command)) {
							this.console.showHelp(command,this.helpText[command][0],this.helpText[command][1]);
						}
					}
				break;
				default:
				case 'modal':
					$("#guide").dialog({
						width: "70vw"
					});
				break;
			}
		},
		/**
			Sets the alert status of the game interface to none, yellow or red.
			Different alerts produce different effects, and enable different features from the console and
			on the HUD.
			@method Game#setAlert
			@param {string} to - One of "none","yellow" or "red", defaults to "none".
		*/
		setAlert: function(to) {
			this.alert = to;
			switch(to) {
				default:
				case "none":
					$("#viewscreen").css({
						"border":"solid 3px #999"
					});
					break;
				case "yellow":
					this.addFunction(function() {
						if(this.frameNumber % 30 == 0) {
							$("#viewscreen").animate({
								borderColor: "#990"
							},'fast').animate({
								borderColor: "#999"
							},'fast');
							this.audio.playSound('yellow-alert');
						}
						return (this.alert != "yellow");
					});
					break;
				case "red":
					this.addFunction(function() {
						if(this.frameNumber % 30 == 0) {
							$("#viewscreen").animate({
								borderColor: "#900"
							},'fast').animate({
								borderColor: "#999"
							},'fast');
						}
						if(this.frameNumber % 15 == 0) {
							this.audio.playSound('red-alert');
						}
						return (this.alert != "red");
					});
					break;
			}
		}
	}
	return Game;
});