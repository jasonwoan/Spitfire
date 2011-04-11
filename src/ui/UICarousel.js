SPITFIRE.ui = SPITFIRE.ui || {};

//--------------------------------------
// SPITFIRE.ui.UICarousel
//--------------------------------------

SPITFIRE.ui.UICarousel = function() {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.ui.UICarousel');
  this._items = [];
  this._itemHeight = 150;
  this._neighbors = 1;
  this._itemDistance = 160;
  this._speed = 500;
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
  'speed'
];

SPITFIRE.ui.UICarousel.prototype = {

  //--------------------------------------
  // Getters / Setters
  //--------------------------------------
  
  setPositionIndex: function(value) {  
    if (this._positionIndex == value) return;
    
    var oldPositionIndex = this._positionIndex || 0;
    
    var delta = this.items()[oldPositionIndex].carouselIndex() - this.items()[value].carouselIndex();
    var i, len, item, newIndex, newPos, indexFromCenter, opacity;
    
    for (i = 0, len = this.items().length; i < len; i += 1) {
      item = this.items()[i];
      
      // assign new carousel index to item
      newIndex = item.carouselIndex() + delta;
      newIndex = (newIndex < 0 || newIndex >= len) ? (newIndex < 0) ? newIndex + len : newIndex - len : newIndex;
      item.carouselIndex(newIndex);
      item.carousel(this);
      newPos = item.carouselIndex() * this.itemDistance() + startX;
      
      // adjust z-index 
      indexFromCenter = Math.abs(this.centerIndex() - newIndex);
      item.$this().css('z-index', len - indexFromCenter);
      
      // opacity
      opacity = (indexFromCenter <= this.neighbors()) ? 1 : 0;
      
      // animate
      item.$this().animate({
        regXValue: newPos,
        regYValue: this.center().y,
        opacity: opacity,
        scaleValue: 1 - indexFromCenter * .2
      }, {
        duration: this._speed * Math.abs(delta),
        step: this.animationStep.context(this),
        complete: this.animationComplete
      });
    }
    
    this._positionIndex = value; 
  },

  //--------------------------------------
  // Methods
  //--------------------------------------
  
  init: function() {
    this.callSuper();
    
    // set center point
    this.center(new SPITFIRE.geom.Point(Math.round(this.w() * 0.5), Math.round(this.w() * 0.5)));
    
    // add class to element
    this.$this().addClass('sf-carousel');
    
    // init items
    var nodeList = this.getElementsByTagName('div');
    var i, len, el;
    for (i = 0, len = nodeList.length; i < len; i += 1) {
      el = nodeList[i];
      el.index(i);
      this.items().push(el);
      
      // scale items according to itemHeight property
      var rect = SPITFIRE.utils.RatioUtils.scaleWidth(el.rect(), this.itemHeight(), true);
      nodeList[i].rect(rect);
    }
    
    // position items
    var rightIndex = 1,
        leftIndex = this.items().length - 1,
        xPos = this.center().x,
        yPos = this.center().y,
        centerItem = this.items()[0],
        rightXPos = xPos + this.itemDistance(),
        leftXPos = xPos - this.itemDistance(),
        rightItem, leftItem,
        count = 0,
        opacity;
        
    this.centerIndex(Math.floor(this.items().length * 0.5));
    
    centerItem.regX(xPos);
    centerItem.regY(yPos);
    centerItem.$this().css('opacity', 1);
    centerItem.carouselIndex(this.centerIndex());

    while (rightIndex <= leftIndex) {
      count++;
      opacity = (count > this.neighbors()) ? 0 : 1;
      rightItem = this.items()[rightIndex];
      
      if (rightItem) {
        rightItem.regX(rightXPos);
        rightItem.regY(yPos);
        rightItem.carouselIndex(this.centerIndex() + count);
        rightItem.$this().css('opacity', opacity);
        rightXPos += this.itemDistance();
        rightIndex++;
      }
      
      leftItem = this.items()[leftIndex];
      if (leftItem) {
        leftItem.regX(leftXPos);
        leftItem.regY(yPos);
        leftItem.carouselIndex(this.centerIndex() - count);
        leftItem.$this().css('opacity', opacity);
        
        leftXPos -= this.itemDistance();
        leftIndex--;
      }
    }
    
    startX = leftItem.cssX() + leftItem.registration().x;
    
    this.positionIndex(0);
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
  
  animationStep: function(now, fx) {
    var data = fx.elem.id + ' ' + fx.prop + ': ' + now;
    
    switch (fx.prop) {
      case 'scaleValue':
        fx.elem.scale(now);
      break;
      
      case 'regXValue':
        fx.elem.regX(now);
      break;
      
      case 'regYValue':
        fx.elem.regY(now);
      break;
    }
  },
  
  animationComplete: function() {
  },

  toString: function() {
    return '[' + this.qualifiedClassName() + ']';
  }
};

SPITFIRE.Class(SPITFIRE.ui.UICarousel);
