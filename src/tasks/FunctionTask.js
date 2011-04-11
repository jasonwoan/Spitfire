SPITFIRE.tasks = SPITFIRE.tasks || {};

//--------------------------------------
// SPITFIRE.tasks.FunctionTask
//--------------------------------------

SPITFIRE.tasks.FunctionTask = function(context, method) {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.tasks.FunctionTask');
  this.method(method);
  this.context(context);
  this.args([]);
  var i, len;
  for (i = 2, len = arguments.length; i < len; i += 1) {
  	this.args().push(arguments[i]);
  }
};

SPITFIRE.tasks.FunctionTask.superclass = SPITFIRE.tasks.Task;
SPITFIRE.tasks.FunctionTask.synthesizedProperties = ['context', 'method', 'args'];

SPITFIRE.tasks.FunctionTask.prototype = {
  //--------------------------------------
  // Methods
  //--------------------------------------
  
  start: function() {
    this.method().apply(this.context(), this.args());
    this.complete();
  },

  toString: function() {
    return '[' + this.qualifiedClassName() + ']';
  }
};

SPITFIRE.Class(SPITFIRE.tasks.FunctionTask);