define("ConditionNode",[],function() {
	var VALID_OPERATORS = [
		'==',
		'!=',
		'>',
		'<',
		''
	];
	function ConditionNode(options) {
		this.setLeftNode(options.leftNode);
		// otherwise we'd throw an error if the condition has no right-hand operand, which would be wrong since we can recover from such situations
		if(options.rightNode) {
			this.setRightNode(options.rightNode);
		}
		this.operator = options.operator || "";
		this.type = "ConditionNode";
	}
	ConditionNode.prototype.value = function() {
		var v;
		switch(this.operator) {
			case '==':
				v = (this.leftNode.value() == this.rightNode.value());
				break;
			case '!=':
				v = (this.leftNode.value() != this.rightNode.value());
				break;
			case '>':
				v = (this.leftNode.value() > this.rightNode.value());
				break;
			case '<':
				v = (this.leftNode.value() < this.rightNode.value());
				break;
			default:
				// without an operator, default to evaluating the value of leftNode for truthyness
				v = !!this.leftNode.value();
				break;
		}
		return v;
	}
	ConditionNode.prototype.setLeftNode = function(n) {
		if('value' in n && n.value instanceof Function) {
			this.leftNode = n;
		} else {
			throw new Error("Type error: left-hand-side of conditional statement has indeterminate value.  Node type: " + n.type);
		}
		return this;
	}
	ConditionNode.prototype.setRightNode = function(n) {
		if('value' in n && n.value instanceof Function) {
			this.rightNode = n;
		} else {
			throw new Error("Type error: right-hand-side of conditional statement has indeterminate value.  Node type: " + n.type);
		}
		return this;
	}
	ConditionNode.prototype.setOperator = function(o) {
		if(o && VALID_OPERATORS.indexOf(o) == -1) {
			throw new Error("Invalid boolean operator used: " + o);
		} else {
			this.operator = o || "";
		}
	}
	return ConditionNode;
});