define("Node",[],function() {
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
	var BTNode = function(type) {
		this.state = "ready";
		this.nodeType = type || "priority";
	}
	BTNode.prototype = {
		/**
			Must be one of "ready", "success", "running", "failed" or "error"
			@member BTNode#state
		*/
		state: "ready"
	}
	return BTNode;
});