SPITFIRE.ui = SPITFIRE.ui || {};

//--------------------------------------
// SPITFIRE.ui.UIButton
//--------------------------------------

SPITFIRE.ui.UIButton = function() {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.ui.UIButton');
};

SPITFIRE.ui.UIButton.superclass = SPITFIRE.display.DisplayObject;
SPITFIRE.ui.UIButton.synthesizedProperties = [];

SPITFIRE.ui.UIButton.prototype = {
  
  //--------------------------------------
  // Event Handlers
  //--------------------------------------
  
  mouseOverHandler: function(event) {
    this.$this().addClass('sf-over');
  },
  
  mouseOutHandler: function(event) {
    this.$this().removeClass('sf-over');
  },
  
  clickHandler: function(event) {
  },
  
  mouseUpHandler: function(event) {
    this.$this().removeClass('sf-down');
  },
  
  mouseDownHandler: function(event) {
    this.$this().addClass('sf-down');
  },

  //--------------------------------------
  // Methods
  //--------------------------------------
  
  init: function() {
    this.callSuper();
    
    // add event listeners
    SPITFIRE.addListener(this, 'click', 'clickHandler');
    SPITFIRE.addListener(this, 'mouseover', 'mouseOverHandler');
    SPITFIRE.addListener(this, 'mouseout', 'mouseOutHandler');
    SPITFIRE.addListener(this, 'mouseup', 'mouseUpHandler');
    SPITFIRE.addListener(this, 'mousedown', 'mouseDownHandler');
  },
  
  toString: function() {
    return '[' + this.qualifiedClassName() + ']';
  }
};

SPITFIRE.Class(SPITFIRE.ui.UIButton);
