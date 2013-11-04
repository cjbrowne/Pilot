(function() {
	var camera, scene, renderer, $viewer = $("#viewscreen"), pitchObject, yawObject;

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
		updateParticles();
		renderer.render(scene,camera);
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