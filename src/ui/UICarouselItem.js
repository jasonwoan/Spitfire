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
  
  // create container
  var el = document.createElement('div');
  el.className = 'carouselItemContainer';
  this.$el = $(el);
  this.$el.append(this.$img);
  this.displayObject = new SPITFIRE.DisplayObject(this.$el);
  this.imgDisplayObject = new SPITFIRE.DisplayObject(this.$img);
  this.imgDisplayObject.setIsCentered(true);
  this.$img.css('opacity', 0);
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

  setItemDimensions: function(width, height) {
    this.setItemWidth(width);
    this.setItemHeight(height);
    this.imgDisplayObject.setW(this._itemWidth);
    this.imgDisplayObject.setH(this._itemHeight);
    this.imgDisplayObject.scale(this._scale);
  },
  
  animate: function(x, y, z, scale, opacity, duration) {
    this.displayObject.animate({
      l: x,
      t: y,
      z: z
    }, {
      duration: duration
    });
    
    this.imgDisplayObject.animate({
      scale: scale,
      opacity: opacity
    }, {
      duration: duration
    });
  }
};

SPITFIRE.Class(SPITFIRE.UICarouselItem);