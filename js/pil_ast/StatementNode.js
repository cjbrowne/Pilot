(function() {
	function StatementNode(options) {
		if(options.f) {
			this.setFunction(options.f);
		}
		this.type = "StatementNode";
	}
	this._f = function(done) { done(); return undefined; }
	StatementNode.prototype.value = function(callback) {
		return this._f(callback);
	}
	StatementNode.prototype.setFunction = function(f) {
		this._f = f;
	}
	window.StatementNode = StatementNode;
})();