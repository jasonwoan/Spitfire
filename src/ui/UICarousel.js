SPITFIRE.ui = SPITFIRE.ui || {};

//--------------------------------------
// SPITFIRE.ui.UICarousel
//--------------------------------------

SPITFIRE.ui.UICarousel = function() {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.ui.UICarousel');
};

SPITFIRE.ui.UICarousel.superclass = SPITFIRE.Object;
SPITFIRE.ui.UICarousel.synthesizedProperties = [];

SPITFIRE.ui.UICarousel.prototype = {

  //--------------------------------------
  // Methods
  //--------------------------------------

  toString: function() {
    return '[' + this.qualifiedClassName() + ']';
  }
};

SPITFIRE.Class(SPITFIRE.ui.UICarousel);
