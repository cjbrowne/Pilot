(function() {
	var camera, scene, renderer, $viewer = $("#viewscreen");

	var particles = [];

	init();

	function init() {
		camera = new THREE.PerspectiveCamera(80, $viewer.width() / $viewer.height(), 1, 4000);

		scene = new THREE.Scene();
		scene.add(camera);

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
		camera.rotateOnAxis(new THREE.Vector3(1,0,0),rot.pitch);
		camera.rotateOnAxis(new THREE.Vector3(0,1,0),rot.yaw);
		camera.rotateOnAxis(new THREE.Vector3(0,0,1),rot.roll);
	}


})();