require.config({
	baseUrl: "js/AI"
});
define(["BehaviourTree/BehaviourTreeCompiler"],function(BehaviourTreeCompiler) {
	/**
		The BehaviourTreeBrain represents a backend AI implementation based on the Behaviour Tree model of AI.
		@constructor BehaviourTreeBrain
	*/
	var BehaviourTreeBrain = function(difficulty) {
		var self = this;
		this.difficulty = Math.max(0,Math.min(difficulty,12));
		$.get("/ai/bt/" + difficulty + ".json",function(rawTree) {
			var btc = new BehaviourTreeCompiler(rawTree);
			self.bt = btc.compile();
		});
	}
	/** @lends BehaviourTreeBrain */
	BehaviourTreeBrain.prototype = {
		decision: "idle",
		decide: function(cb) {
			this.bt.traverse(this.decision);
		}
	}
	return BehaviourTreeBrain;
});