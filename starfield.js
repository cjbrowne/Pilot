(function() {
	var camera, scene, renderer, $viewer = $("#viewscreen"), pitchObject, yawObject;
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

		requestAnimationFrame(update);
	}

	function update() {
		requestAnimationFrame(update);
		ctx.clearRect(0,0,$viewer.width(),$viewer.height());
		updateParticles();
		renderer.render(scene,camera);
		renderHud();
	}

	function renderHud() {
		ctx.fillStyle = "rgb(255,255,255)";
		ctx.font = "8pt monospace";
		ctx.fillText("STARSHIP " + ship.designation,50,50);
		ctx.fillText("Booster systems: ",50,60);
		var stringLoc = 0;
		for(var booster in ship.warningStrings.booster) {
			if(ship.warningStrings.booster.hasOwnProperty(booster)) {
				if(ship.warningStrings.booster[booster] == "") {
					ctx.fillText(booster + ": OK",55,70 + stringLoc);
				} else {
					ctx.save();
					ctx.fillStyle = "rgb(255,0,0)";
					ctx.fillText(booster + ": " + ship.warningStrings.booster[booster],55,70 + stringLoc);
					ctx.restore();
				}
				stringLoc += 10;
			}
		}

		ctx.save();

		// render the health bar
		for(var i = 0; i < Math.floor(ship.getHealth() / 10); i++) {
			
			if(i < 3) {
				ctx.fillStyle = "rgba(255,0,0,0.5)";
			} else {
				ctx.fillStyle = "rgba(0,255,0,0.5)";
			}
			ctx.fillRect(32 + (i * 18), $viewer.height() - 64 , 16, 32);
		}
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