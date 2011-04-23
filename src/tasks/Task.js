//--------------------------------------
// SPITFIRE.Task
//--------------------------------------

SPITFIRE.Task = function() {
  this.callSuper();
  this.setQualifiedClassName('SPITFIRE.Task');
  this.setProgress(0);
};

SPITFIRE.Task.superclass = SPITFIRE.EventDispatcher;
SPITFIRE.Task.synthesizedProperties = [
  'progress',
  'progressive',
  'name',
  'debug'
];

SPITFIRE.Task.prototype = {
  //--------------------------------------
  // Methods
  //--------------------------------------
  
  start: function() {
    this.setProgress(0);
  },
  
  complete: function() {
    this.setProgress(1);
    this.trigger(new SPITFIRE.Event(SPITFIRE.Event.COMPLETE));
  },
  
  toString: function() {
    return '[' + this.getQualifiedClassName() + ' name=' + this.getName() + ']';
  }
};

SPITFIRE.Class(SPITFIRE.Task);