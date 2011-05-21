/*global SPITFIRE*/

//--------------------------------------
// SPITFIRE.FunctionTask
//--------------------------------------

SPITFIRE.FunctionTask = function(context, method) {
  this.callSuper();
  this.setQualifiedClassName('SPITFIRE.FunctionTask');
  this.setMethod(method);
  this.setContext(context);
  this.setArgs([]);
  var i, len;
  for (i = 2, len = arguments.length; i < len; i += 1) {
		this.getArgs().push(arguments[i]);
  }
};

SPITFIRE.FunctionTask.superclass = SPITFIRE.Task;
SPITFIRE.FunctionTask.synthesizedProperties = ['context', 'method', 'args'];

SPITFIRE.FunctionTask.prototype = {
  //--------------------------------------
  // Methods
  //--------------------------------------
  
  start: function() {
    this.getMethod().apply(this.getContext(), this.getArgs());
    this.complete();
  },

  toString: function() {
    return '[' + this.getQualifiedClassName() + '] function:' + this.getMethod()._name;
  }
};

SPITFIRE.Class(SPITFIRE.FunctionTask);