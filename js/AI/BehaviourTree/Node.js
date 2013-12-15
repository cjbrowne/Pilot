define("BehaviourTree/Node",[],function() {
	var VALID_STATES = [
		"ready",
		"success",
		"running",
		"failed",
		"error"
	];
	var VALID_TYPES = [
		"priority",
		"sequence",
		"loop",
		"random",
		"concurrent",
		"decorator",
		"action",
		"condition"
	];
	var Node = function() {
		this.state = "ready";
	}
	Node.prototype = {
		state: "ready",
		children: [],
		evaluate: function(decision) {
			return this.state;
		}
	}
	Node.Priority = function(children) {
		this.children = children;
	}
	Node.Priority.prototype = Node;
	Node.Priority.prototype.evalute = function(decision) {
		for(var i = 0; i < this.children.length; i++) {
			this.state = this.children[i].evaluate(decision);
			if(this.state == "success") {
				// early return is cheapest way to implement priority nodes
				return this.state;
			}
		}
		return this.state;
	}
	Node.Sequence = function(children) {
		this.children = children;
	}
	Node.Loop = function(children) {
		this.children = children;
	}
	Node.Random = function(children) {
		this.children = children;
	}
	Node.Concurrent = function(children) {
		this.children = children;
	}
	Node.Decorator = function(children) {
		if(children.length > 1) {
			throw new Error("Decorator nodes should only have one child.");
		}
		this.children = children;
	}
	Node.Action = function(action) {
		this.action = action;
	}
	Node.Condition = function(condition) {
		this.condition = condition;
	}
	return Node;
});