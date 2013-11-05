var audio_enabled = false;
(function() {
	var camera, scene, renderer, $viewer = $("#viewscreen"), pitchObject, yawObject,frameNumber = 0,speaker;
	var ctx = $("#viewscreen")[0].getContext('2d');

	var particles = [];

	init();

	function init() {
		camera = new THREE.PerspectiveCamera(80, $viewer.width() / $viewer.height(), 1, 4000);

		camera.rotation.set(0,0,0);

		pitchObject = new THREE.Object3D();
		pitchObject.add(camera);

		yawObject = new THREE.Object3D();
		yawObject.position.y = 10;
		yawObject.add(pitchObject);


		scene = new THREE.Scene();
		scene.add(yawObject);

		renderer = new THREE.CanvasRenderer({canvas:$viewer[0]});
		renderer.setSize( $viewer.width(), $viewer.height() );

		makeParticles();

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
		updateParticles();
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
		} else {
			ctx.fillText("Booting up" + Array(Math.floor((frameNumber / 10) % 5)).join("."),50,50);
		}

		ctx.save();

		// render the health bar
		if(frameNumber < 200 || frameNumber > 230 || frameNumber % 16 < 8) {
			for(var i = 0; i < Math.floor(ship.getHealth() / 10) && i*20 < frameNumber; i++) {
				if(i < 3) {
					ctx.fillStyle = "rgba(255,0,0,0.5)";
				} else {
					ctx.fillStyle = "rgba(0,255,0,0.5)";
				}
				ctx.fillRect(32 + (i * 18), $viewer.height() - 64 , 16, 32);
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
	}

	function makeParticles() {
		var particle, material;

		for(var zpos = -1000; zpos < 1000; zpos += 20) {
			material = new THREE.ParticleCanvasMaterial({color:0xffffff, program:particleRender});
			particle = new THREE.Particle(material);

			particle.position.x = Math.random() * 1000 - 500;
			particle.position.y = Math.random() * 1000 - 500;

			particle.position.z = zpos;

			particle.scale.x = particle.scale.y = 1;

			scene.add(particle);
			particles.push(particle);
		}
	}

	function particleRender(context) {
		context.beginPath();
		context.arc(0,0,1,0,Math.PI * 2,true);
		context.fill();
	}

	function updateParticles() {
		for(var i = 0; i < particles.length; i++) {
			var particle = particles[i];
			if(particle.position.z>1000) particle.position.z-=2000;
		}
		var rot = ship.getRotation();
		/* -- my attempt at making the camera rotate with the ship:
		yawObject.rotation.y -= rot.yaw * 0.002;
		pitchObject.rotation.x -= rot.pitch * 0.002;
		var PI_2 = Math.PI * 2;
		pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2,pitchObject.rotation.x));
		*/

	}


})();