//--------------------------------------
// SPITFIRE.Task
//--------------------------------------

SPITFIRE.Task = function() {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.Task');
  this.progress(0);
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
    this.progress(0);
  },
  
  complete: function() {
    this.progress(1);
    this.trigger(new SPITFIRE.Event(SPITFIRE.Event.COMPLETE));
  },
  
  toString: function() {
    return '[' + this.qualifiedClassName() + ' name=' + this.name() + ']';
  }
};

SPITFIRE.Class(SPITFIRE.Task);