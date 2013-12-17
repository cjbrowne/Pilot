require.config({
	baseUrl: "js/pil_ast/"
});

define("ast_built",[
	"ConditionNode",
	"ConstantNode",
	"PropertyAccessNode",
	"VariableNode",
	"FunctionNode",
	"StatementNode",
	"DelayNode"
],function(ConditionNode,ConstantNode,PropertyAccessNode,VariableNode,FunctionNode,StatementNode,DelayNode) {
	if(
		!ConditionNode
		|| !ConstantNode
		|| !PropertyAccessNode
		|| !VariableNode
		|| !FunctionNode
		|| !StatementNode
		|| !DelayNode
	) {
		throw new Error("A Node came up undefined.  Here's what I got as arguments: " + JSON.stringify(arguments));
	}
	return {
		ConditionNode: ConditionNode,
		ConstantNode: ConstantNode,
		PropertyAccessNode: PropertyAccessNode,
		VariableNode: VariableNode,
		FunctionNode: FunctionNode,
		StatementNode: StatementNode,
		DelayNode: DelayNode
	};
});