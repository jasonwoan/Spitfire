SPITFIRE.tasks = SPITFIRE.tasks || {};

//--------------------------------------
// SPITFIRE.tasks.Task
//--------------------------------------

SPITFIRE.tasks.Task = function() {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.tasks.Task');
  this.progress(0);
};

SPITFIRE.tasks.Task.superclass = SPITFIRE.events.EventDispatcher;
SPITFIRE.tasks.Task.synthesizedProperties = [
  'progress',
  'progressive',
  'name',
  'debug'
];

SPITFIRE.tasks.Task.prototype = {
  //--------------------------------------
  // Methods
  //--------------------------------------
  
  start: function() {
    this.progress(0);
  },
  
  complete: function() {
    this.progress(1);
    this.trigger(new SPITFIRE.events.Event(SPITFIRE.events.Event.COMPLETE));
  },
  
  toString: function() {
    return '[' + this.qualifiedClassName() + ' name=' + this.name() + ']';
  }
};

SPITFIRE.Class(SPITFIRE.tasks.Task);