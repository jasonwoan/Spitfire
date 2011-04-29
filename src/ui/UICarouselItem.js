//--------------------------------------
// SPITFIRE.UICarouselItem
//--------------------------------------

SPITFIRE.UICarouselItem = function(name, url, index) {
  this.callSuper(name);
  this.qualifiedClassName('SPITFIRE.UICarouselItem');
  this._itemHeight = 100;
  this._scale = 1;
  this._itemIndex = index;
  this.loader = new SPITFIRE.JQueryImageLoaderTask(url);
  this.$img = this.loader.get$content();
/*   this.$img.bind('click', $.proxy(this.clickHandler, this)); */
  
  // create container
  var el = document.createElement('div');
  el.className = 'carouselItemContainer';
  this.$el = $(el);
  this.$el.append(this.$img);
  this.displayObject = new SPITFIRE.DisplayObject(this.$el);
  this.imgDisplayObject = new SPITFIRE.DisplayObject(this.$img);
  this.imgDisplayObject.setIsCentered(true);
};

SPITFIRE.UICarouselItem.superclass = SPITFIRE.State;
SPITFIRE.UICarouselItem.synthesizedProperties = [
  'itemIndex',
  'carouselIndex',
  'carousel',
  'img',
  'itemHeight',
  'itemWidth'
];

SPITFIRE.UICarouselItem.prototype = {

  //--------------------------------------
  // Getters / Setters
  //--------------------------------------
  
  setItemHeight: function(value) {
    this._itemHeight = value;
    this.resizeAndScaleImage();
  },
  
  setScale: function(value) {
    this._scale = value;
    this.resizeAndScaleImage();
  },
  
  getScale: function() {
    return this._scale;
  },
  
  getTransitionIn: function() {
    return new SPITFIRE.FunctionTask(this, this.transitionIn);
  },
  
  //--------------------------------------
  // Event Handlers
  //--------------------------------------
  
  clickHandler: function(event) {
    this.getParent().setPositionIndex(this.getItemIndex());
  },

  //--------------------------------------
  // Methods
  //--------------------------------------
  
  transitionIn: function() {
    this.getParent().setPositionIndex(this.getItemIndex());
  },

  resizeAndScaleImage: function() {
    var rect = new SPITFIRE.Rectangle(0, 0, this.imgDisplayObject.w(), this.imgDisplayObject.h());
    var newRect = SPITFIRE.RatioUtils.scaleWidth(rect, this._itemHeight, true);
    this.imgDisplayObject.w(newRect.width());
    this.imgDisplayObject.h(newRect.height());
    this.imgDisplayObject.scale(this._scale);
  },
  
  animate: function(x, y, z, scale, opacity, duration) {
    this.displayObject.animate({
      l: x,
      t: y,
      z: z,
      opacity: opacity
    }, {
      duration: duration
    });
    
    this.imgDisplayObject.animate({
      scale: scale
    }, {
      duration: duration
    });
  }
};

SPITFIRE.Class(SPITFIRE.UICarouselItem);