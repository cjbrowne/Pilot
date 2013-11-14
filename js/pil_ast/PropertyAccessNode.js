(function() {
	function PropertyAccessNode(options) {
		if(options.parentObject) {
			this.setParentObject(options.parentObject);
		}
		if(options.propertyName) {
			this.setPropertyName(options.propertyName);
		}
		if(options.accessFunction) {
			this.setAccessFunction(options.accessFunction);
		}
		this.type = "PropertyAccessNode";
	}
	// by setting the prototype parent object to window, we allow globally-scoped variables to be referenced by not setting a parent object
	// it also reduces the rate at which errors might occur, although I dare say trying to access window[""] might cause problems
	PropertyAccessNode.prototype._parentObject = null;
	PropertyAccessNode.prototype._propertyName = "";
	PropertyAccessNode.prototype._accessFunction = function(o,p) {
		return o[p];
	}
	PropertyAccessNode.prototype.value = function() {
		return this._accessFunction(this._parentObject,this._propertyName);
	}
	PropertyAccessNode.prototype.setParentObject = function(o) {
		this._parentObject = o;
		return this;
	}
	PropertyAccessNode.prototype.setPropertyName = function(n) {
		this._propertyName = n;
		return this;
	}
	PropertyAccessNode.prototype.setAccessFunction = function(f) {
		this._accessFunction = f;
	}
	window.PropertyAccessNode = PropertyAccessNode;
})();