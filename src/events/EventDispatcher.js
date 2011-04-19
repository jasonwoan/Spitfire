//--------------------------------------
// EventDispatcher
//--------------------------------------

SPITFIRE.EventDispatcher = function() {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.EventDispatcher');
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
    for (var i = 0, len = this._eventListeners[type].length; i < len; i++) {
      if (this._eventListeners[type][i] == handler) {
        this._eventListeners[type].splice(i, 1);
      }
    }
  },
  
  trigger: function(event) {
    event.target(this);
    var args = [event];
    
    if (this._eventListeners[event.type()]) {
      for (var j = 0, len = this._eventListeners[event.type()].length; j < len; j++) {
        this._eventListeners[event.type()][j].apply(this, args);
      }
    }
  }
};

SPITFIRE.Class(SPITFIRE.EventDispatcher);