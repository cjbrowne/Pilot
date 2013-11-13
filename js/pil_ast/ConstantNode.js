(function() {
	function ConstantNode(value) {
		this._value = value;
		this.type = "ConstantNode";
	}
	ConstantNode.prototype.value = function() {
		return this._value;
	}
	window.ConstantNode = ConstantNode;
})();