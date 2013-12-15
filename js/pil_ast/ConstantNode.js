define("ConstantNode",[],function() {
	function ConstantNode(value) {
		this._value = value;
		this.type = "ConstantNode";
	}
	ConstantNode.prototype.value = function() {
		return this._value;
	}
	return ConstantNode;
});