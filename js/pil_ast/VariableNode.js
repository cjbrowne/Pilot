(function() {
	function VariableNode(options) {
		this.value = options.initialValue;
		this.type = "VariableNode";
	}
	VariableNode.prototype.value = function() {
		return this.value;
	}
	VariableNode.prototype.setValue = function(v) {
		this.value = v;
		return this;
	}
	window.VariableNode = VariableNode;
})();