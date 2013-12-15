define(["BehaviourTree/Node","Ship"],function(BTNode,Ship) {
	var ACTIONS = {
		"move away from player": function() { this.decision.set("evade"); },
		"move towards player": function() { this.decision.set("close"); },
		"fire fore": function() { this.decision.set("fire_fore"); },
		"fire aft": function() { this.decision.set("fire_aft"); },
		"do nothing": function() { this.decision.set("idle"); },
		"aim fore gun at player": function() { this.decision.set("aim_fore"); },
		"aim aft gun at player": function() { this.decision.set("aim_aft"); }
	};
	var CONDITIONS = {
		"player is nearby": function(game,enemy) {
			return (game.player.location.distanceTo(enemy.position) < (Ship.GUN_RANGE * 2));
		},
		"player is in range": function(game,enemy) {
			return (game.player.location.distanceTo(enemy.position) < Ship.GUN_RANGE);
		},
		"fore gun is ready": function(game,enemy) {
			return (enemy.ship.cannons.fore.cooldown == 0);
		},
		"aft gun is ready": function(game,enemy) {
			return (enemy.ship.cannons.aft.cooldown == 0);
		}
	}
	var BehaviourTree = function(rootNode) {
		this.root = rootNode;
	};
	BehaviourTree.prototype = {
		root: null,
		traverse: function(decision) {
			switch(this.root.state) {
				case "ready": {
					this.root.evaluate(decision);
					break;
				}
			}
		}
	}
	var BTCompiler = function(rawTree) {
		if(!rawTree.root) {
			throw new Error("No root node defined.");
		}
		this.raw_bt = rawTree;
	}
	BTCompiler.prototype = {
		bt: null,
		raw_bt: null,
		compile: function() {
			this.bt = new BehaviourTree(this.parseNode(this.raw_bt.root));
			return this.bt;
		},
		parseNode: function(rawNode) {
			var parsedNode,self=this;
			if(rawNode.children) {
				var parsed_children = [];
				rawNode.children.forEach(function(child) {
					if(typeof child == "string") {
						parsed_children.push(self.parseNode(self.raw_bt[child]));
					} else {
						parsed_children.push(self.parseNode(child));
					}
				});
			}
			switch(rawNode.type) {
				case "priority": {
					parsedNode = new BTNode.Priority(parsed_children);
					break;
				}
				case "sequence": {
					parsedNode = new BTNode.Sequence(parsed_children);
					break;
				}
				case "loop": {
					parsedNode = new BTNode.Loop(parsed_children);
					break;
				}
				case "random": {
					parsedNode = new BTNode.Random(parsed_children);
					break;
				}
				case "concurrent": {
					parsedNode = new BTNode.Concurrent(parsed_children);
					break;
				}
				case "decorator": {
					parsedNode = new BTNode.Decorator(parsed_children);
					break;
				}
				case "action": {
					if(!(rawNode.action in ACTIONS)) {
						throw new Error("Unrecognised action in definition of action node: " + rawNode.action);
					}
					parsedNode = new BTNode.Action(ACTIONS[rawNode.action]);
					break;
				}
				case "condition": {
					if(!(rawNode.condition in CONDITIONS)) {
						throw new Error("Unrecognised condition in definition of condition node: " + rawNode.condition);
					}
					parsedNode = new BTNode.Condition(CONDITIONS[rawNode.condition]);
					break;
				}
			}
			return parsedNode;
		}
	}
	return BTCompiler;
});