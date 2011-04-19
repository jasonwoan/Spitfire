//--------------------------------------
// SPITFIRE.FunctionTask
//--------------------------------------

SPITFIRE.FunctionTask = function(context, method) {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.FunctionTask');
  this.method(method);
  this.context(context);
  this.args([]);
  var i, len;
  for (i = 2, len = arguments.length; i < len; i += 1) {
  	this.args().push(arguments[i]);
  }
};

SPITFIRE.FunctionTask.superclass = SPITFIRE.Task;
SPITFIRE.FunctionTask.synthesizedProperties = ['context', 'method', 'args'];

SPITFIRE.FunctionTask.prototype = {
  //--------------------------------------
  // Methods
  //--------------------------------------
  
  start: function() {
    this.method().apply(this.context(), this.args());
    this.complete();
  },

  toString: function() {
    return '[' + this.qualifiedClassName() + '] function:' + this.method()._name;
  }
};

SPITFIRE.Class(SPITFIRE.FunctionTask);