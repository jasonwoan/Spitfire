SPITFIRE.ui = SPITFIRE.ui || {};

//--------------------------------------
// SPITFIRE.ui.UICarouselItem
//--------------------------------------

SPITFIRE.ui.UICarouselItem = function() {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.ui.UICarouselItem');
};

SPITFIRE.ui.UICarouselItem.superclass = SPITFIRE.display.DisplayObject;
SPITFIRE.ui.UICarouselItem.synthesizedProperties = [
  'index',
  'carouselIndex',
  'carousel'
];

SPITFIRE.ui.UICarouselItem.prototype = {

  //--------------------------------------
  // Event Handlers
  //--------------------------------------

  //--------------------------------------
  // Methods
  //--------------------------------------
  
  init: function() {
    this.callSuper();
  },

  toString: function() {
    return '[' + this.qualifiedClassName() + ']';
  }
};

SPITFIRE.Class(SPITFIRE.ui.UICarouselItem);