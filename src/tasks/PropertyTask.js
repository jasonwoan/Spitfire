SPITFIRE.tasks = SPITFIRE.tasks || {};

//--------------------------------------
// SPITFIRE.tasks.PropertyTask
//--------------------------------------

SPITFIRE.tasks.PropertyTask = function(target, property, value) {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.tasks.PropertyTask');
  this.target(target);
  this.property(property);
  this.value(value);
};

SPITFIRE.tasks.PropertyTask.superclass = SPITFIRE.tasks.Task;
SPITFIRE.tasks.PropertyTask.synthesizedProperties = ['target', 'property', 'value'];

SPITFIRE.tasks.PropertyTask.prototype = {
  //--------------------------------------
  // Methods
  //--------------------------------------
  
  start: function() {
    this.target()[this.property()](this.value());
    this.complete();
  },
  
  toString: function() {
    return '[' + this.qualifiedClassName() + ' target=' + this.target() + ' property=' + this.property() + ' value=' + this.value() + ']';
  }
};

SPITFIRE.Class(SPITFIRE.tasks.PropertyTask);