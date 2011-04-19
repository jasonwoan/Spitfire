//--------------------------------------
// SPITFIRE.UICarouselItem
//--------------------------------------

SPITFIRE.UICarouselItem = function() {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.UICarouselItem');
  this._itemHeight = 100;
  this._isImgInitialized = false;
};

SPITFIRE.UICarouselItem.superclass = SPITFIRE.DisplayObject;
SPITFIRE.UICarouselItem.synthesizedProperties = [
  'index',
  'carouselIndex',
  'carousel',
  'img',
  'itemHeight',
  'itemWidth',
  'isImgInitialized'
];

SPITFIRE.UICarouselItem.prototype = {

  //--------------------------------------
  // Getters / Setters
  //--------------------------------------
  
  setItemHeight: function(value) {
    this._itemHeight = value;
    
    if (this.img().complete) {
      this.imageLoadedHandler();
    }
  },
  
  setScale: function(value) {
    this._scale = value;
    if (this.img().complete) {
      this.imageLoadedHandler();
    }
  },
  
  getScale: function() {
    return this._scale;
  },
  
  //--------------------------------------
  // Event Handlers
  //--------------------------------------
  
  imageLoadedHandler: function() {
    SPITFIRE.removeListener(this.img(), 'load', this.imageLoadedHandler);
    this.initImage();
    this.resizeImage();
    this.scaleAndPositionImage();
  },

  //--------------------------------------
  // Methods
  //--------------------------------------
  
  init: function() {
    this.callSuper();
    
    this.img(this.getElementsByTagName('img')[0]);
    
    if (!this.img().complete) {
      SPITFIRE.addListener(this.img(), 'load', this.imageLoadedHandler, this);
    } else {
      this.imageLoadedHandler();
    }
  },
  
  initImage: function() {
    if (this._isImgInitialized) return;
    
    // explicity set width and height to DisplayObject
    this.img().w(this.img().width);
    this.img().h(this.img().height);
    
    this._isImgInitialized = true;
  },
  
  resizeImage: function() {
    var rect = new SPITFIRE.Rectangle(0, 0, this.img().w(), this.img().h());
    var newRect = SPITFIRE.RatioUtils.scaleWidth(rect, this._itemHeight, true);
    this.img().w(newRect.width());
    this.img().h(newRect.height());
  },
  
  scaleAndPositionImage: function() {
    // scale
    this.img().scale(this._scale);
    
    // position
    this.img().l(~~(-this.img().w() * 0.5));
    this.img().t(~~(-this.img().h() * 0.5));
  },

  toString: function() {
    return '[' + this.qualifiedClassName() + ']';
  }
};

SPITFIRE.Class(SPITFIRE.UICarouselItem);