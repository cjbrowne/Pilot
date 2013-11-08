var audio_enabled = true;
(function() {
	var camera, scene, renderer, $viewer = $("#viewscreen"), pitchObject, yawObject,frameNumber = 0,speaker,starfield,pitchObject,yawObject;
	var ctx = $("#viewscreen")[0].getContext('2d');

	var PI_2 = Math.PI / 2;
	var particles = [];
	$(document).ready(function() {
		init();
	});

	function init() {
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
		camera.position.z = 1.5;

		camera.rotation.set(0,0,0);

		pitchObject = new THREE.Object3D();
		pitchObject.add(camera);
		yawObject = new THREE.Object3D();
		yawObject.position.y = 10;
		yawObject.add(pitchObject);
		scene.add(yawObject);
		
		renderer = new THREE.WebGLRenderer();
		renderer.setSize( $viewer.width(), $viewer.height() );
		$("#space").append(renderer.domElement);
		ctx.canvas.width = $viewer.width();
		ctx.canvas.height = $viewer.height();
		

		var geometry  = new THREE.SphereGeometry(90, 32, 32);
		var material  = new THREE.MeshBasicMaterial();
		material.map   = THREE.ImageUtils.loadTexture('galaxy_starfield.png');
		material.side  = THREE.BackSide;
		starfield  = new THREE.Mesh(geometry, material);
		scene.add(starfield);

		// add a target 
		var droneGeom = new THREE.SphereGeometry(1,32,32);
		var droneMat = new THREE.MeshBasicMaterial({
			color:0xFF0000
		});
		drone = new THREE.Mesh(droneGeom,droneMat);
		drone.position.x = 5;
		drone.position.y = 5;
		drone.position.z = -20;
		scene.add(drone);

		var light = new THREE.AmbientLight(0xF0F0F0);
		scene.add(light);

		setupAudio();
		requestAnimationFrame(update);
	}

	function setupAudio() {
		window.AudioContext = window.AudioContext || window.webkitAudioContext;

		if('AudioContext' in window) {
			speaker = new AudioContext();
		} else {
			console.log("Audio API unsupported on this browser.  Disabling audio.");
			audio_enabled = false;
			return;
		}
	}

	function update() {
		requestAnimationFrame(update);
		ctx.clearRect(0,0,$viewer.width(),$viewer.height());
		var velocity = ship.getVelocity();

		var shipRot = ship.getRotation();
		yawObject.rotation.y = shipRot.y;
		pitchObject.rotation.x = shipRot.x;
		pitchObject.rotation.z = shipRot.z;

		camera.translateY(velocity.y);
		camera.translateZ(velocity.z);
		
		ship.setPosition(camera.position);

		starfield.position.getPositionFromMatrix(camera.matrixWorld);


		renderer.render(scene,camera);
		renderHud();
		if(audio_enabled) doSounds();
		frameNumber++;
	}

	function makeBeep(duration, type, freq, finishedCallback) {
        duration = +duration;

        freq = freq || 440;

        // Only 0-4 are valid types.
        type = (type % 5) || 0;

        if (typeof finishedCallback != "function") {
            finishedCallback = function () {};
        }

        var osc = speaker.createOscillator();

        osc.type = type;

        osc.connect(speaker.destination);
        osc.frequency.value = freq;
        osc.noteOn(0);

        setTimeout(function () {
            osc.noteOff(0);
            finishedCallback();
        }, duration);
    };

	function doSounds() {
		switch(frameNumber) {
			case 60:
				makeBeep(200,1,400);
				break;
			case 180:
				makeBeep(200,1,500);
				break;
			case 220:
				makeBeep(100,1,400);
				break;
			case 225:
				makeBeep(100,1,500);
				break;
			case 230:
				makeBeep(100,1,600);
				break;
		}
		if(ship.warnings.booster && frameNumber % 20 == 0) {
			makeBeep(100,1,800);
		}
	}

	function renderHud() {
		ctx.fillStyle = "rgb(255,255,255)";
		ctx.font = "8pt monospace";
		if(frameNumber > 60) {
			ctx.fillText("STARSHIP " + ship.designation,50,50);
			ctx.fillText("Booster systems: ",50,60);
			ctx.fillText("Core Systems:",50,130);
			var stringLoc = 0;
			if(frameNumber > 180) {
				for(var booster in ship.warningStrings.booster) {
					if(ship.warningStrings.booster.hasOwnProperty(booster)) {
						if(ship.warningStrings.booster[booster] == "") {
							ctx.fillText(booster + ": " + ship.boosters[booster],55,70 + stringLoc);
						} else {
							ctx.save();
							ctx.fillStyle = "rgb(255,0,0)";
							ctx.fillText(booster + ": " + ship.warningStrings.booster[booster],55,70 + stringLoc);
							ctx.restore();
						}
						stringLoc += 10;
					}
				}
			} else {
				ctx.fillText("Loading" + Array(Math.floor((frameNumber / 10) % 5)).join("."),55,70);
			}
			if(frameNumber > 210) {
				if(ship.warningStrings.health == "") {
					ctx.fillText("Structural Integrity: OK",55,140);
				} else {
					ctx.save();
					ctx.fillStyle = "rgb(255,0,0)";
					ctx.fillText("Structural Integrity: " + ship.warningStrings.health,55,140);
					ctx.restore();
				}
			} else {
				ctx.fillText("Loading" + Array(Math.floor((frameNumber / 10) % 5)).join("."),55,140);
			}
		} else {
			ctx.fillText("Booting up" + Array(Math.floor((frameNumber / 10) % 5)).join("."),50,50);
		}

		ctx.save();

		// render the health bar
		if(frameNumber < 200 || frameNumber > 230 || frameNumber % 16 < 8) {
			if(ship.getHealth() > 30 || frameNumber % 16 < 8) {
				if(ship.getHealth() > 10 || frameNumber % 8 < 4) {
					for(var i = 0; i < Math.floor(ship.getHealth() / 10) && i*20 < frameNumber; i++) {
						if(i < 3) {
							ctx.fillStyle = "rgba(255,0,0,0.5)";
						} else {
							ctx.fillStyle = "rgba(0,255,0,0.5)";
						}
						ctx.fillRect(32 + (i * 18), $viewer.height() - 64 , 16, 32);
					}
				}
			}
		}
		ctx.restore();

		// render the fore gun angle indicator
		ctx.save();
		ctx.fillStyle = ctx.strokeStyle = "rgba(100,100,255,0.5)";
		//if(frameNumber > 200) {
			ctx.beginPath();
			ctx.arc($viewer.width() - 75,75,50,0,Math.PI*2,true);
			ctx.moveTo($viewer.width() - 115,75)
			ctx.lineTo($viewer.width() - 35,75);
			ctx.closePath();
			ctx.stroke();
		/*
		} else {
			ctx.fillText("Loading" + Array(Math.floor((frameNumber / 10) % 5)).join("."),$viewer.width() - 125,75)
		}
		*/
		ctx.restore();

		// debug ship information
		ctx.save();
		var shipRot = ship.getRotation();
		var shipPos = ship.getPosition();
		var shipVel = ship.getVelocity();
		ctx.fillStyle = "rgb(255,255,255)";
		ctx.fillText("Yaw: " + shipRot.y.toFixed(2),$viewer.width() - 200, $viewer.height() - 100);
		ctx.fillText("Pitch: " + shipRot.x.toFixed(2),$viewer.width() - 200, $viewer.height() - 90);
		ctx.fillText("Roll: " + shipRot.z.toFixed(2),$viewer.width() - 200, $viewer.height() - 80);
		ctx.fillText("X: " + shipPos.x.toFixed(2),$viewer.width() - 200,$viewer.height() - 70);
		ctx.fillText("Y: " + shipPos.y.toFixed(2),$viewer.width() - 200,$viewer.height() - 60);
		ctx.fillText("Z: " + shipPos.z.toFixed(2),$viewer.width() - 200,$viewer.height() - 50);
		ctx.fillText("Horizontal velocity: " + (shipVel.z*100).toFixed(2),$viewer.width() - 200,$viewer.height() - 40);
		ctx.fillText("Vertical velocity: " + (shipVel.y*100).toFixed(2),$viewer.width() - 200,$viewer.height() - 30);
		ctx.restore();

	}


})();