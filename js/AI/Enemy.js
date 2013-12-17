require.config({
	baseUrl: "js/AI"
});
define(["BehaviourTreeBrain","Ship"],function(Brain,Ship) {
	/**
		The Enemy class controls a single artificially-intelligent enemy.  It's a frontend AI class, used for abstracting
		away all of the backend into a single uniform interface.  The implementation of the backend is entirely arbitrary, as long
		as it exposes a "tick" function which is executed once per logic loop.
		The backend should also expose a Decision object which is examined each tick and used to control the ship object.
		So this class can be seen as a sort of "bridge" between the Brain backend and the Ship frontend.
		@constructor Enemy
		@param {number} difficulty - A difficulty rating capped between 0 and 12.
	*/
	var Enemy = function(difficulty) {
		this.brain = new Brain(difficulty);
		this.ship = new Ship();
	}
	/**
		@lends Enemy
	*/
	Enemy.prototype = {
		/**
			Whether this enemy instance is alive or not.
			@default true
			@member {boolean} Enemy#alive
		*/
		alive: true,
		/**
			How difficult this AI is to fight against.
			@default 0
			@member {number} Enemy#difficulty
		*/
		difficult: 0,
		/**
			The ship object that the enemy is controlling.
			@default null
			@member {Ship} Enemy#ship
		*/
		ship: null,
		/**
			The artificial intelligence backend used by the Enemy.  Algorithm-agnostic.
		*/
		brain: null,
		/**
			Passes in a once-per-tick logic function to the Game instance.
			This is essentially the AI's "main" function.
			@method Enemy#attachToGame
			@param {Game} game - The game instance to attach to.
		*/
		attachToGame: function(game) {
			var enemy = this;
			game.addFunction(function() {
				// to stop ourselves from starting to make a new decision every frame even if we haven't
				// finished the old decision yet, the 'brain' implementation must expose a 'state' which
				// can be one of "idle" (for this purpose), "thinking" or "acting".
				if(enemy.brain.state == "idle") {
					// because we can't guarantee that Brain's algorithm is synchronous, we must provide a callback
					// to be executed once the brain has reached a decision.
					brain.decide(function(decision) {
						console.log(decision);
					});
				}
				return !enemy.alive;
			});
		},
		/**
			Dynamically change the difficulty of an enemy.
			@method Enemy#setDifficulty
			@param {number} to - The target difficulty rating (zero through twelve)
		*/
		setDifficulty: function(to) {
			brain.setDifficulty(to);
		},
		/**
			Triggers a death animation for the enemy.
			@method Enemy#triggerDeathAnimation
			@param {Game} game - A game object we can harvest render and audio backends from.
		*/
		triggerDeathAnimation: function(game) {

		},
		/**
			Calculates the distance between this enemy instance and the player.
			@method Enemy#playerDistance
			@returns {number} - The distance from ourselves to the player.
		*/
		playerDistance: function() {

		},
		/**
			Returns a string identifying the class.
			@method Enemy#toString
			@returns {string} - "Enemy AI Actor"
		*/
		toString: function() {
			return "Enemy AI Actor";
		},
		/**
			Although strictly these should be static, the interface from the BT compiler uses
			dynamic actions and conditions.  The reasoning being that we could face a situation
			where the actions and conditions available to an actor change during run-time.
			@member Enemy#actions
		*/
		actions: {
			"move away from player": function() { this.decision.set("evade"); },
			"move towards player": function() { this.decision.set("close"); },
			"flank player": function() { this.decision.set("flank"); },
			"fire fore": function() { this.decision.set("fire_fore"); },
			"fire aft": function() { this.decision.set("fire_aft"); },
			"do nothing": function() { this.decision.set("idle"); },
			"aim fore gun at player": function() { this.decision.set("aim_fore"); },
			"aim aft gun at player": function() { this.decision.set("aim_aft"); }
		},
		/**
			See Enemy#actions
			@member Enemy#conditions
		*/
		conditions: {
			"player is nearby": function() {
			        return (this.playerDistance() < (Ship.GUN_RANGE * 2));
			},
			"player is in range": function() {
			        return (this.playerDistance() < Ship.GUN_RANGE);
			},
			"fore gun is ready": function() {
			        return (this.ship.cannons.fore.cooldown == 0);
			},
			"aft gun is ready": function() {
			        return (this.ship.cannons.aft.cooldown == 0);
			}
		}
	}
	return Enemy;
});