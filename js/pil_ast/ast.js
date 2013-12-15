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