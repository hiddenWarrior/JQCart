//localStorage.setItem("cItems","{}");

var extend = function  (base,derived) {
	derived.prototype = Object.create(base.prototype);
	derived.prototype.constructor = derived;
}