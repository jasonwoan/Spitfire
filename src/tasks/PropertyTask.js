//--------------------------------------
// SPITFIRE.PropertyTask
//--------------------------------------

SPITFIRE.PropertyTask = function(target, property, value) {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.PropertyTask');
  this.target(target);
  this.property(property);
  this.value(value);
};

SPITFIRE.PropertyTask.superclass = SPITFIRE.Task;
SPITFIRE.PropertyTask.synthesizedProperties = ['target', 'property', 'value'];

SPITFIRE.PropertyTask.prototype = {
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

SPITFIRE.Class(SPITFIRE.PropertyTask);