function triggerExplosion(scene,object) {
	var particleCount = 1000,
	particles = new THREE.Geometry(),
	pMaterial = new THREE.ParticleBasicMaterial({
		color:0xFF0000,
		size: 20
	});

	for(var p = 0; p < particleCount; p++) {
		var pX = object.position.x,
			pY = object.position.y,
			pZ = object.position.z,
			particle = new THREE.Vector3(pX, pY, pZ);
		particle.velocity = new THREE.Vector3(Math.random()*50 - 25,Math.random()*50 - 25,Math.random() * 50 - 25);
		particles.vertices.push(particle);
	}

	var particleSystem = new THREE.ParticleSystem(
		particles,
		pMaterial
	);
	scene.add(particleSystem);
	var aliveParticles = particleCount;
	ship.customFunctions.push(function() {
		if(aliveParticles < 0) {
			scene.remove(particleSystem);
			return false;
		}
		particleSystem.rotation += 0.01;
		var pCount = particleCount;
		while(pCount--) {
			var particle = particles.vertices[pCount];
			if(	Math.abs(particle.y - object.position.y) >= 300 ||
				Math.abs(particle.x - object.position.x) >= 300 ||
				Math.abs(particle.z - object.position.z) >= 300	){
				particle.x = -10000;
				particle.y = -10000;
				particle.z = -10000;
				aliveParticles--;
			}
			particle.add(particle.velocity);
		}
		particleSystem.geometry.verticesNeedUpdate = true;
	});
}