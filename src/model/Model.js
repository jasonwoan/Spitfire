SPITFIRE.model = SPITFIRE.model || {};

//--------------------------------------
// SPITFIRE.model.Model
//--------------------------------------

SPITFIRE.model.Model = function() {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.model.Model');
};

SPITFIRE.model.Model.superclass = SPITFIRE.events.EventDispatcher;
SPITFIRE.model.Model.synthesizedProperties = ['data'];

SPITFIRE.model.Model.prototype = {

  //--------------------------------------
  // Getters / Setters
  //--------------------------------------
  
  setData: function(value) {
    this._data = value;
    this.trigger(new SPITFIRE.events.ModelEvent(SPITFIRE.events.ModelEvent.DATA_UPDATE));
  },

  //--------------------------------------
  // Methods
  //--------------------------------------

  toString: function() {
    return '[' + this.qualifiedClassName() + ']';
  }
};

SPITFIRE.Class(SPITFIRE.model.Model);