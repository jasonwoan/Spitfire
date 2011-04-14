SPITFIRE.ui = SPITFIRE.ui || {};

//--------------------------------------
// SPITFIRE.ui.UICarousel
//--------------------------------------

SPITFIRE.ui.UICarousel = function() {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.ui.UICarousel');
  this._items = [];
  this._itemHeight = 200;
  this._neighbors = 2;
  this._itemDistance = 160;
  this._speed = 500;
  this._scaleRatio = .3;
  this._positionIndex = 0;
};

SPITFIRE.ui.UICarousel.superclass = SPITFIRE.display.DisplayObject;
SPITFIRE.ui.UICarousel.synthesizedProperties = [
  'items',
  'center',
  'itemHeight',
  'neighbors',
  'itemDistance',
  'positionIndex',
  'startX',
  'centerIndex',
  'speed',
  'scaleRatio'
];

SPITFIRE.ui.UICarousel.prototype = {

  //--------------------------------------
  // Getters / Setters
  //--------------------------------------
  
/*
  setItemHeight: function(value) {
    this._itemHeight = value;
    
    // update items
    var i, len;
    for (i = 0, len = this.items().length; i < len; i += 1) {
      this.items()[i].itemHeight(this._itemHeight);
    }
  },
  
  setItemDistance: function(value) {
    this._itemDistance = value;
    
    // reposition carousel
    this.positionItems();
  },
  
  setScaleRatio: function(value) {
    this._scaleRatio = value;
    
    this.positionIndex(this._positionIndex);
  },
  
  setNeighbors: function(value) {
    this._neighbors = value;
    
    this.positionItems();
    this.positionIndex(this._positionIndex);
  },
*/
  
  setPositionIndex: function(value) {  
/*     if (this._positionIndex == value) return; */
    
    var oldPositionIndex = this._positionIndex;
    
    var delta = this.items()[oldPositionIndex].carouselIndex() - this.items()[value].carouselIndex();
    var i, len, item, newIndex, newPos, indexFromCenter, opacity, scale, z,
        half = (this.items().length * 0.5 >> 0) + 1; 
    
    for (i = 0, len = this.items().length; i < len; i += 1) {
      item = this.items()[i];
      
      // assign new carousel index to item
      newIndex = item.carouselIndex() + delta;
      newIndex = (newIndex < 0 || newIndex >= len) ? (newIndex < 0) ? newIndex + len : newIndex - len : newIndex;
      item.carouselIndex(newIndex);
      item.carousel(this);
      newPos = item.carouselIndex() * this.itemDistance() + this.startX();
      
      // adjust z-index 
      indexFromCenter = Math.abs(this.centerIndex() - newIndex);
      z = (half - indexFromCenter) * 25;
      //item.$this().css('z-index', len - indexFromCenter);
      
      // opacity
      opacity = (indexFromCenter <= this.neighbors()) ? 1 : 0;
      
      // scale
      scale = 1 - indexFromCenter * this.scaleRatio();
      
      // animate
      item.animate({
        l: newPos,
        t: this.center().y,
        opacity: opacity,
        scale: scale,
        z: z
      }, {
        duration: this._speed * Math.abs(delta)
      });
    }
    
    this._positionIndex = value;
    
    this.trigger(new SPITFIRE.events.Event(SPITFIRE.events.Event.CHANGE));
  },

  //--------------------------------------
  // Methods
  //--------------------------------------
  
  init: function() {
    this.callSuper();
    
    // set center point
    this.center(new SPITFIRE.geom.Point(Math.round(this.w() * 0.5), Math.round(this.h() * 0.5)));
    
    // add class to element
    this.$this().addClass('sf-carousel');
    
    // init items
    var nodeList = this.getElementsByTagName('div');
    var i, len, el;
    for (i = 0, len = nodeList.length; i < len; i += 1) {
      el = nodeList[i];
      el.index(i);
      el.itemHeight(this.itemHeight());
      this.items().push(el);
    }
    
    this.positionItems();
    
    this.positionIndex(0);
  },
  
  positionItems: function() {
    var rightIndex = this._positionIndex + 1,
        leftIndex = (this._positionIndex - 1 >= 0) ? this._positionIndex - 1 : this.items().length - 1,
        startLeft = leftIndex,
        startRight = rightIndex,
        xPos = this.center().x,
        yPos = this.center().y,
        centerItem = this.items()[this._positionIndex],
        rightXPos = xPos + this.itemDistance(),
        leftXPos = xPos - this.itemDistance(),
        rightItem, leftItem,
        count = 0,
        halfNumItems = Math.ceil((this.items().length - 1) * 0.5),
        opacity;
        
    this.centerIndex(Math.floor(this.items().length * 0.5));
    
    centerItem.l(xPos);
    centerItem.t(yPos);
    centerItem.$this().css('opacity', 1);
    centerItem.carouselIndex(this.centerIndex());

    while (count < halfNumItems) {
/*       log('left: ' + leftIndex + ' right: ' + rightIndex); */
      count++;
      opacity = (count > this.neighbors()) ? 0 : 1;
      rightItem = this.items()[rightIndex];
      
      if (rightItem) {
        rightItem.l(rightXPos);
        rightItem.t(yPos);
        rightItem.carouselIndex(this.centerIndex() + count);
        rightItem.$this().css('opacity', opacity);
        rightXPos += this.itemDistance();
        rightIndex++;
        
        if (rightIndex >= this.items().length)
          rightIndex = 0;
      }
      
      leftItem = this.items()[leftIndex];
      if (leftItem) {
        leftItem.l(leftXPos);
        leftItem.t(yPos);
        leftItem.carouselIndex(this.centerIndex() - count);
        leftItem.$this().css('opacity', opacity);
        
        leftXPos -= this.itemDistance();
        leftIndex--;
        
        if (leftIndex < 0)
          leftIndex = this.items().length - 1;
      }
    }
    
    this.startX(leftItem.l());
  },
  
  previous: function() {
    var nextIndex = this.positionIndex() - 1;
    nextIndex = (nextIndex < 0) ? this.items().length - 1 : nextIndex;
    this.positionIndex(nextIndex);
  },
  
  next: function() {
    var nextIndex = this.positionIndex() + 1;
    nextIndex = (nextIndex >= this.items().length) ? 0 : nextIndex;
    this.positionIndex(nextIndex);
  },

  toString: function() {
    return '[' + this.qualifiedClassName() + ']';
  }
};

SPITFIRE.Class(SPITFIRE.ui.UICarousel);
