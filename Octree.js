(function() {
	function OctTree(options) {
		this.root = new Node(options.rootNodeInformation);
	}

	OctTree.prototype.insert = function(item) {
		if(item instanceof Array) {
			var len = item.length;
			for(var i=0;i<len;i++) {
				this.root.insert(item[i]);
			}
		} else {
			this.root.insert(item);
		}
	}

	OctTree.prototype.clear = function() {
		this.root.clear();
	}

	OctTree.prototype.retrieve = function(item) {
		return this.root.retrieve(item).slice(0);
	}

	function Node(information) {
		information = information || {};
		this._bounds = information.bounds;
		this.children = [];
		this.nodes = [];
		if(information.maxChildren) {
			this._maxChildren = information.maxChildren;
		}
		if(information.maxDepth) {
			this._maxDepth = information.maxDepth;
		}
		if(information.tier) {
			this._tier = information.tier;
		}
	}

	Node.prototype.nodes = null;
	Node.prototype._classConstructor = Node;

	Node.prototype.children = null;
	Node.prototype._bounds = null;

	Node.prototype._tier = 0;

	Node.prototype._maxChildren = 8;
	Node.prototype._maxDepth = 8;

	Node.TOP_LEFT_FRONT = 0;
	Node.TOP_RIGHT_FRONT = 1;
	Node.TOP_LEFT_BACK = 2;
	Node.TOP_RIGHT_BACK = 3;
	Node.BOTTOM_LEFT_FRONT = 4;
	Node.BOTTOM_RIGHT_FRONT = 5;
	Node.BOTTOM_LEFT_BACK = 6;
	Node.BOTTOM_RIGHT_BACK = 7;

	Node.prototype.insert = function(item) {
		if(this.nodes.length) {
			var index = this._findIndex(item);
			this.nodes[index].insert(item);
			return;
		}

		this.children.push(item);

		var len = this.children.length;
		if(!(this._depth >= this._maxDepth) && 
                len > this._maxChildren)
		{
			this.subdivide();
			for(var i = 0; i < len; i++) {
				this.insert(this.children[i]);
			}
			this.children.length = 0;
		}
	}

	Node.prototype.retrieve = function(item) {
		if(this.nodes.length)
        {
                var index = this._findIndex(item);
                
                return this.nodes[index].retrieve(item);
        }
        
        return this.children;
	}

	Node.prototype._findIndex = function(item) {
		var b = this._bounds;
		var left = (item.position.x > b.x + b.width / 2);
		var top = (item.position.y > b.y + b.height / 2);
		var front = (item.position.z > b.z + b.depth / 2);
		var index = TOP_LEFT_BACK;
		if(left) {
			if(top) {
				if(!back) {
					index = Node.TOP_LEFT_FRONT;
				}
			} else {
				if(back) {
					index = Node.BOTTOM_LEFT_BACK;
				} else {
					index = Node.BOTTOM_LEFT_FRONT;
				}
			}
		} else {
			if(top) {
				if(back) {
					index = Node.TOP_RIGHT_BACK;
				} else {
					index = Node.TOP_RIGHT_FRONT;
				}
			} else {
				if(back) {
					index = Node.BOTTOM_RIGHT_BACK;
				} else {
					index = Node.BOTTOM_RIGHT_FRONT;
				}
			}
		}
		return index;
	}

	Node.prototype.subdivide = function() {
		var tier = this._tier + 1;
		var bx = this._bounds.x;
		var by = this._bounds.y;
		var bz = this._bounds.z;

		var b_w_h = (this._bounds.width / 2)|0;
		var b_h_h = (this._bounds.height / 2)|0;
		var b_d_h = (this._bounds.depth / 2)|0;
		var bx_b_w_h = bx + b_w_h;
        var by_b_h_h = by + b_h_h;
        var bz_b_d_h = bz + b_d_h;

        this.nodes[Node.TOP_LEFT_FRONT] = new this._classConstructor({
        	x:bx,
        	y:by,
        	z:bz,
        	width:b_w_h,
        	height:b_h_h,
        	depth:b_d_h,
        	tier: tier
        });

        this.nodes[Node.TOP_RIGHT_FRONT] = new this._classConstructor({
        	x:bx_b_w_h,
        	y:by,
        	z:bz,
        	width:b_w_h,
        	height:b_h_h,
        	depth:b_d_h,
        	tier: tier
        });

        this.nodes[Node.BOTTOM_LEFT_FRONT] = new this._classConstructor({
        	x:bx,
        	y:by_b_h_h,
        	z:bz,
        	width:b_w_h,
        	height:b_h_h,
        	depth:b_d_h,
        	tier: tier
        });

        this.nodes[Node.BOTTOM_RIGHT_FRONT] = new this._classConstructor({
        	x:bx_b_w_h,
        	y:by_b_h_h,
        	z:bz,
        	width:b_w_h,
        	height:b_h_h,
        	depth:b_d_h,
        	tier: tier
        });

        // back nodes

        this.nodes[Node.TOP_LEFT_BACK] = new this._classConstructor({
        	x:bx,
        	y:by,
        	z:bz_b_d_h,
        	width:b_w_h,
        	height:b_h_h,
        	depth:b_d_h,
        	tier: tier
        });

        this.nodes[Node.TOP_RIGHT_BACK] = new this._classConstructor({
        	x:bx_b_w_h,
        	y:by,
        	z:bz_b_d_h,
        	width:b_w_h,
        	height:b_h_h,
        	depth:b_d_h,
        	tier: tier
        });

        this.nodes[Node.BOTTOM_LEFT_BACK] = new this._classConstructor({
        	x:bx,
        	y:by_b_h_h,
        	z:bz_b_d_h,
        	width:b_w_h,
        	height:b_h_h,
        	depth:b_d_h,
        	tier: tier
        });

        this.nodes[Node.BOTTOM_RIGHT_BACK] = new this._classConstructor({
        	x:bx_b_w_h,
        	y:by_b_h_h,
        	z:bz_b_d_h,
        	width:b_w_h,
        	height:b_h_h,
        	depth:b_d_h,
        	tier: tier
        });
	}

	Node.prototype.clear = function() {
		this.children.length = 0;
		var len = this.nodes.length;
		for(var i = 0; i < len; i++) {
			this.nodes[i].clear();
		}
		this.nodes.length = 0;
	}

	window.OctTree = OctTree;
})();