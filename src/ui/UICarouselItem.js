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
  'carousel',
  'img'
];

SPITFIRE.ui.UICarouselItem.prototype = {

  //--------------------------------------
  // Getters / Setters
  //--------------------------------------
  
  setRect: function(value) {
    this.callSuper(value);
    
    this.img().h(value.height());
  },

  //--------------------------------------
  // Event Handlers
  //--------------------------------------

  //--------------------------------------
  // Methods
  //--------------------------------------
  
  init: function() {
    this.callSuper();
    
    this.img(this.getElementsByTagName('img')[0]);
  },

  toString: function() {
    return '[' + this.qualifiedClassName() + ']';
  }
};

SPITFIRE.Class(SPITFIRE.ui.UICarouselItem);