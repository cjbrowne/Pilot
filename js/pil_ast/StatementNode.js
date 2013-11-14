(function() {
	function StatementNode(options) {
		if(options.f) {
			this.setFunction(options.f);
		}
		this.type = "StatementNode";
	}
	this._f = function() { return undefined; }
	StatementNode.prototype.value = function() {
		return this._f();
	}
	StatementNode.prototype.setFunction = function(f) {
		this._f = f;
	}
	window.StatementNode = StatementNode;
})();