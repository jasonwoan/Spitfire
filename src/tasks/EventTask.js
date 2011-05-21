/*global SPITFIRE*/

//--------------------------------------
// SPITFIRE.EventTask
//--------------------------------------

SPITFIRE.EventTask = function(target, eventName, method) {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.EventTask');
  this.target(target);
  this.eventName(eventName || 'complete');
  this.method(method);
};

SPITFIRE.EventTask.superclass = SPITFIRE.Task;
SPITFIRE.EventTask.synthesizedProperties = ['target', 'eventName', 'method'];

SPITFIRE.EventTask.prototype = {
  
  //--------------------------------------
  // Event Handlers
  //--------------------------------------
  
  eventCompleteHandler: function(event) {
    this.complete();
  },
  
  //--------------------------------------
  // Methods
  //--------------------------------------
  
  start: function() {
    this._target.bind(this._eventName, this.eventCompleteHandler.context(this));
    if (typeof this._method !== 'undefined') {
      this._method.apply(this._target);
    }
  },
  
  toString: function() {
    return '[' + this.qualifiedClassName() + ' target=' + this.target() + ' eventName=' + this.eventName() + ' method=' + this.method() + ']';
  }
};

SPITFIRE.Class(SPITFIRE.EventTask);