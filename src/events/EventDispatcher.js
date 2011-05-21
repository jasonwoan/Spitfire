/*global SPITFIRE*/

//--------------------------------------
// EventDispatcher
//--------------------------------------

SPITFIRE.EventDispatcher = function() {
  this.callSuper();
  this.setQualifiedClassName('SPITFIRE.EventDispatcher');
  this._eventListeners = {};
};

SPITFIRE.EventDispatcher.superclass = SPITFIRE.Object;

SPITFIRE.EventDispatcher.prototype = {
  bind: function(type, handler) {
    if (!this._eventListeners[type]) {
      this._eventListeners[type] = [];
    }
    this._eventListeners[type].push(handler);
  },
  
  unbind: function(type, handler) {
    // remove all listeners of type if no handler is specified
    if (typeof handler === 'undefined') {
      this._eventListeners[type] = [];
      return;
    }
    
    for (var i = 0, len = this._eventListeners[type].length; i < len; i += 1) {
      if (this._eventListeners[type][i] === handler) {
        this._eventListeners[type].splice(i, 1);
      }
    }
  },
  
  trigger: function(event) {
    event.setTarget(this);
    var args = [event], j, len;
    
    if (this._eventListeners[event.getType()]) {
      for (j = 0, len = this._eventListeners[event.getType()].length; j < len; j += 1) {
        this._eventListeners[event.getType()][j].apply(this, args);
      }
    }
  }
};

SPITFIRE.Class(SPITFIRE.EventDispatcher);