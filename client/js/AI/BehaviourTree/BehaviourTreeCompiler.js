define(["BehaviourTree/Node","Ship"],function(BTNode,Ship) {
	/**
		The BehaviourTree class provides a structure into which
		we can compile a raw behaviour tree.  The behaviour tree can then
		be traversed on demand using a simple function call.
		@constructor BehaviourTree
	*/
	var BehaviourTree = function(rootNode) {
		if(!rootNode) {
			throw new Error("Behaviour tree must have a root node");
		} else if(!(rootNode instanceof Node)) {
			throw new Error("Root node is not a Node.");
		}
		this.root = rootNode;
	};
	/** @lends BehaviourTree */
	BehaviourTree.prototype = {
		/**
			The root node of the behaviour tree.
			@member BehaviourTree#root
		*/
		root: null,
		traverse: function(decision) {
			switch(this.root.state) {
				case "ready": {
					this.root.evaluate(decision);
					break;
				}
				case "running": {
					break;
				}
				case "success": {
					this.root.clearState();
					decision.clear();
					break;
				}
				case "failed": {
					this.root.clearState();
					decision.clear();
					break;
				}
				case "error": {
					throw new Error(this.root.getError());
					this.root.clearState();
					decision.clear();
					break;
				}
				default: {
					throw new Error("Unrecognised state of root node.");
					break;
				}
			}
		}
	}
	var BTCompiler = function() {};
	BTCompiler.prototype = {
		bt: null,
		last_compiled: null,
		compile: function(rawTree,actor) {
			if(_.isEqual(rawTree,last_compiled)) {
				// early return cache value
				return this.bt;
			}
			last_compiled = rawTree;
			if(!rawTree.root) {
				throw new Error("No root node defined.");
			}
			if(!actor) {
				throw new Error("Must pass in an actor that the compiled BT will control.");
			}
			var raw_root;
			if(typeof rawTree.root == "string") {
				raw_root = rawTree[rawTree.root];
			} else {
				raw_root = rawTree.root;
			}
			// cache the compiled behaviourTree
			this.bt = new BehaviourTree(this.parseNode(raw_root));
			return this.bt;
		},
		parseNode: function(rawNode) {
			if(typeof rawNode == "string") {
				throw new Error("String alias passed instead of raw node object.");
			}
			var parsedNode,self=this;
			if(rawNode.children) {
				var parsed_children = [];
				rawNode.children.forEach(function(child) {
					if(typeof child == "string") {
						parsed_children.push(self.parseNode(self.raw_bt[child]));
					} else {
						parsed_children.push(self.parseNode(child));
					}
				});
			}
			switch(rawNode.type) {
				case "priority": {
					parsedNode = new BTNode.Priority(parsed_children);
					break;
				}
				case "sequence": {
					parsedNode = new BTNode.Sequence(parsed_children);
					break;
				}
				case "loop": {
					parsedNode = new BTNode.Loop(parsed_children);
					break;
				}
				case "random": {
					parsedNode = new BTNode.Random(parsed_children);
					break;
				}
				case "concurrent": {
					parsedNode = new BTNode.Concurrent(parsed_children);
					break;
				}
				case "decorator": {
					parsedNode = new BTNode.Decorator(parsed_children);
					break;
				}
				case "action": {
					if(!(rawNode.action in this.actor.actions)) {
						throw new Error("Actor "+this.actor+" cannot " + rawNode.action);
					}
					parsedNode = new BTNode.Action(ACTIONS[rawNode.action]);
					break;
				}
				case "condition": {
					if(!(rawNode.condition in this.actor.conditions)) {
						throw new Error("Unrecognised condition in definition of condition node: " + rawNode.condition);
					}
					parsedNode = new BTNode.Condition(CONDITIONS[rawNode.condition]);
					break;
				}
			}
			return parsedNode;
		}
	}
	return BTCompiler;
});