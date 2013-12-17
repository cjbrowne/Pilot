define("FunctionNode",[],function() {
	function FunctionNode(options) {
		if(options.statementNodes) {
			this.addStatementNodes(options.statementNodes);
		}
	}
	FunctionNode.prototype.type = "FunctionNode";
	FunctionNode.prototype._statementNodes = [];
	FunctionNode.prototype.addStatementNodes = function(nodes) {
		if(nodes instanceof Array) {
			console.log("pushing many nodes...");
			// monstrous, isn't it?  I love one-liners!
			this._statementNodes = this._statementNodes.concat(nodes.filter(function(n) { return (n instanceof StatementNode);}));
		} else if (nodes instanceof StatementNode) {
			console.log("pushing a node...");
			this._statementNodes.push(nodes);
		} else {
			throw new Error("Language Error: FunctionNode#addStatementNodes passed invalid node type (developer issue, not your fault if you're a player)");
		}
		if(this._statementNodes.length == 0) {
			console.log(nodes);
		}
	}
	FunctionNode.prototype.run = function(done) {
		if(this._statementNodes.length == 0) {
			throw new Error("FunctionNode with no statements!!!");
		} else if(!done) {
			throw new Error("FunctionNode.run called without callback.  This is an error!");
		}
		var index = 0;
		var self = this;
		function runStatement(index) {
			return function() {
				if(self._statementNodes[index+1])
					return self._statementNodes[index].value(runStatement(index+1));
				else
					return self._statementNodes[index].value(done);
			}
		}
		return runStatement(0)();
	}
	return FunctionNode;
});