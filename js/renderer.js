(function() {
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

		this._renderer = new THREE.WebGLRenderer();
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
		this.updateTree();
		
		this.camera.rotateOnAxis(new THREE.Vector3(1,0,0),ship.location.rotationDelta.x);
		this.camera.rotateOnAxis(new THREE.Vector3(0,1,0),ship.location.rotationDelta.y);
		this.camera.rotateOnAxis(new THREE.Vector3(0,0,1),ship.location.rotationDelta.z);
		ship.location.rotationDelta = new THREE.Euler();

		this.camera.translateY(ship.location.velocity.y);
		this.camera.translateZ(-ship.location.velocity.z);

		ship.location.position.getPositionFromMatrix(this.camera.matrixWorld);
		starfield.position.getPositionFromMatrix(this.camera.matrixWorld);

		this._renderer.render(this.scene,this.camera);
	}
	Renderer.prototype.updateTree = function() {
		this.tree.clear();
		this.tree.insert(this.bullets);
		this.tree.insert(this.drones);
	}

	window.Renderer = Renderer;
})();