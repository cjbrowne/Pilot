define("Renderer",["OctTree"],function(OctTree) {
	var BULLET_SIZE = 1,
		DRONE_SIZE = 50;
	var Renderer = function() {
		this.$viewer = $("#viewscreen");
		this.tree = new OctTree({
			bounds: {
				x: 0,
				y: 0,
				z: 0,
				width: 1500,
				height: 1500,
				depth: 1500
			}
		});
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
		this.camera.position.z = 1.5;
		this.camera.quaternion.setFromEuler(new THREE.Euler(0,0,0));
		this.pitchObject = new THREE.Object3D();
		this.pitchObject.add(this.camera);
		this.yawObject = new THREE.Object3D();
		this.yawObject.position.y = 10;
		this.yawObject.add(this.pitchObject);
		this.scene.add(this.yawObject);
		try {
			this._renderer = new THREE.WebGLRenderer();
		} catch(e) {
			console.log("Could not initiate WebGL, falling back to slower Canvas rendering.");
			this._renderer = new THREE.CanvasRenderer();
		}

		this._renderer.setSize( this.$viewer.width(), this.$viewer.height() );
		$("#space").append(this._renderer.domElement);

		// the background
		var geometry  = new THREE.SphereGeometry(1000, 32, 32);
		var material  = new THREE.MeshBasicMaterial();
		material.map   = THREE.ImageUtils.loadTexture('galaxy_starfield.png');
		material.side  = THREE.BackSide;
		starfield  = new THREE.Mesh(geometry, material);
		this.scene.add(starfield);

		var light = new THREE.AmbientLight(0xF0F0F0);
		this.scene.add(light);

		// objects
		this.bullets = [];
		this.drones = [];
	}
	Renderer.prototype.render = function(frameNumber,timeDelta,ship) {
		
		this.camera.rotateOnAxis(new THREE.Vector3(1,0,0),ship.location.rotationDelta.x);
		this.camera.rotateOnAxis(new THREE.Vector3(0,1,0),ship.location.rotationDelta.y);
		this.camera.rotateOnAxis(new THREE.Vector3(0,0,1),ship.location.rotationDelta.z);
		ship.location.rotationDelta = new THREE.Euler();

		this.camera.translateY(ship.location.velocity.y);
		this.camera.translateZ(-ship.location.velocity.z);

		ship.location.position.getPositionFromMatrix(this.camera.matrixWorld);
		starfield.position.getPositionFromMatrix(this.camera.matrixWorld);

		this.updateTree();
		this.updateBullets();

		this._renderer.render(this.scene,this.camera);
	}
	Renderer.prototype.updateTree = function() {
		var tree = this.tree;
		tree.clear();
		tree.insert(this.bullets);
		tree.insert(this.drones);
	}
	Renderer.prototype.updateBullets = function() {
		var self = this;
		this.bullets.forEach(function(b) {
			b.translateZ(-10);
            // remove this bullet if it's out of range
            if(b.position.distanceTo(self.camera.position) > 800) {
                    self.scene.remove(b);
                    self.bullets.splice(b,1);
            }
            nearbyObjects = self.tree.retrieve(b);
            nearbyObjects.forEach(function(nearbyObject) {
                    if(!nearbyObject.isDrone) {
                            return;
                    }
                    if(nearbyObject.position.distanceTo(b.position) < (DRONE_SIZE + BULLET_SIZE)*2) {
                    	game.console.log("Drone destroyed!");
                        self.triggerExplosion(nearbyObject);
                        self.drones.splice(nearbyObject,1);
                        self.scene.remove(nearbyObject);
                        self.bullets.splice(b,1);
                        self.scene.remove(b);
                    }
            });
		});
	}
	Renderer.prototype.fireBullet = function(cannon) {
		var bullet = new THREE.Mesh(
			new THREE.SphereGeometry(BULLET_SIZE,8,8),
			new THREE.MeshBasicMaterial({color:0x00FF00})
        );
        bullet.name = "Bullet " + String.fromCharCode(this.bullets.length+65);
        this.scene.add(bullet);
        bullet.position.getPositionFromMatrix(this.camera.matrix);
        bullet.rotation.setFromRotationMatrix(this.camera.matrix);
        bullet.rotateOnAxis(new THREE.Vector3(1,0,0),cannon.rotation.x);
        bullet.rotateOnAxis(new THREE.Vector3(0,1,0),cannon.rotation.y);
        bullet.translateZ(-15);
        bullet.translateY(-25);
        bullet.width = bullet.height = bullet.depth = BULLET_SIZE;
        this.bullets.push(bullet);
        this.tree.insert.apply(this.tree,bullet);
	}
	Renderer.prototype.triggerExplosion = function(object) {
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
		this.scene.add(particleSystem);
		var scene = this.scene;
		var aliveParticles = particleCount;
		game.addFunction(function() {
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
	return Renderer;
});