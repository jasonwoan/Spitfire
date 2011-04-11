SPITFIRE.ui = SPITFIRE.ui || {};

//--------------------------------------
// SPITFIRE.ui.UICarouselItem
//--------------------------------------

SPITFIRE.ui.UICarouselItem = function() {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.ui.UICarouselItem');
  this._itemHeight = 100;
};

SPITFIRE.ui.UICarouselItem.superclass = SPITFIRE.display.DisplayObject;
SPITFIRE.ui.UICarouselItem.synthesizedProperties = [
  'index',
  'carouselIndex',
  'carousel',
  'img',
  'itemHeight',
  'itemWidth'
];

SPITFIRE.ui.UICarouselItem.prototype = {

  //--------------------------------------
  // Getters / Setters
  //--------------------------------------
  
  setItemHeight: function(value) {
    this._itemHeight = value;
    
    if (this.img().complete)
      this.scaleAndPositionImage();
  },
  
  setScale: function(value) {
    this._scale = value;
    this.scaleAndPositionImage();
  },
  
  getScale: function() {
    return this._scale;
  },
  
  //--------------------------------------
  // Event Handlers
  //--------------------------------------
  
  imageLoadedHandler: function() {
    this.scaleAndPositionImage();
  },

  //--------------------------------------
  // Methods
  //--------------------------------------
  
  init: function() {
    this.callSuper();
    
    this.img(this.getElementsByTagName('img')[0]);
    
    if (!this.img().complete) {
      SPITFIRE.addListener(this.img(), 'load', 'imageLoadedHandler', this);
    } else {
      this.scaleAndPositionImage();
    }
  },
  
  scaleAndPositionImage: function() {
    // scale
    var rect = new SPITFIRE.geom.Rectangle(0, 0, this.img().w(), this.img().h());
    var newRect = SPITFIRE.utils.RatioUtils.scaleWidth(rect, this._itemHeight * this._scale, true);
    this.img().w(newRect.width());
    this.img().h(newRect.height());
    
    // position
    this.img().l(Math.round(-this.img().w() * 0.5));
    this.img().t(Math.round(-this.img().h() * 0.5));
  },

  toString: function() {
    return '[' + this.qualifiedClassName() + ']';
  }
};

SPITFIRE.Class(SPITFIRE.ui.UICarouselItem);