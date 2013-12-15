define("Ship",[],function() {
	var Cannon = function() {
		this.rotation = new THREE.Euler();
		this.rotationDelta = new THREE.Euler();
		this.power = 0;
		this.warning = "";
		this.cooldown = 0;
	}
	Cannon.prototype.fire = function(power) {
		this.power = power || 1;
		return power;
	}
	var Shield = function() {
	}
	Shield.prototype.power = 100;
	Shield.prototype.warning = "";
	Shield.prototype.health = 100;
	var Booster = function(position,orientation) {
		this.power = 0;
		this.warning = "";
		this.position = position || "";
		this.orientation = orientation || "";
	}
	Booster.prototype.valueOf = function() {
		return this.power;
	}
	var StructuralIntegrityField = function() {
		this.power = 0;
		this.warning = "";
	}
	StructuralIntegrityField.prototype.valueOf = function() {
		return this.power;
	}
	var MetaInformation = function() {
		this.designation = "";
		this.pilotName = "";
	}
	var Coordinates = function() {
		this.rotation = new THREE.Euler();
		this.position = new THREE.Vector3();
		this.velocity = new THREE.Vector3();
		this.rotationDelta = new THREE.Euler();
	}
	var Ship = function() {
		this.boostersByName = {
			"fore vertical": new Booster("fore","vertical"),
			"aft vertical": new Booster("aft","vertical"),
			"starboard horizontal": new Booster("starboard","horizontal"),
			"port horizontal": new Booster("port","horizontal"),
			"starboard vertical": new Booster("starboard","vertical"),
			"port vertical": new Booster("port","vertical"),
			"fore horizontal": new Booster("fore","horizontal"),
			"aft horizontal": new Booster("aft","horizontal")
		}
		this.boosters = [
			this.boostersByName["fore vertical"],
			this.boostersByName["aft vertical"],
			this.boostersByName["starboard horizontal"],
			this.boostersByName["port horizontal"],
			this.boostersByName["starboard vertical"],
			this.boostersByName["port vertical"],
			this.boostersByName["fore horizontal"],
			this.boostersByName["aft horizontal"]	
		];
		this.cannons = {
			fore: new Cannon(),
			aft: new Cannon()
		}
		this.shields = {
			fore: new Shield(),
			aft: new Shield()
		}
		this.health = new StructuralIntegrityField();
		this.health.power = 100; // make sure the ship has health to begin with!
		this.meta = new MetaInformation();
		this.location = new Coordinates();
	}
	Ship.GUN_RANGE = 800;
	return Ship;
});