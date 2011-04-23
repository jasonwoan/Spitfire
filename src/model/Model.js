//--------------------------------------
// SPITFIRE.Model
//--------------------------------------

SPITFIRE.Model = function() {
  this.callSuper();
  this.setQualifiedClassName('SPITFIRE.Model');
};

SPITFIRE.Model.superclass = SPITFIRE.EventDispatcher;
SPITFIRE.Model.synthesizedProperties = ['data'];

SPITFIRE.Model.prototype = {

  //--------------------------------------
  // Getters / Setters
  //--------------------------------------
  
  setData: function(value) {
    this._data = value;
    this.trigger(new SPITFIRE.ModelEvent(SPITFIRE.ModelEvent.DATA_UPDATE));
  },

  //--------------------------------------
  // Methods
  //--------------------------------------

  toString: function() {
    return '[' + this.getQualifiedClassName() + ']';
  }
};

SPITFIRE.Class(SPITFIRE.Model);