//--------------------------------------
// SPITFIRE.UICarousel
//--------------------------------------

SPITFIRE.UICarousel = function(config) {
  config.name = config.name || 'carousel';
  this.config = config;
  
  this.callSuper(config.name);
  this.qualifiedClassName('SPITFIRE.UICarousel');
  
  this.data = config.data || [];
  this._items = [];
  this._itemHeight = config.itemHeight || 200;
  this._neighbors = config.neighbors || 2;
  this._itemDistance = config.itemDistance || 160;
  this._speed = config.speed || 500;
  this._scaleRatio = config.scaleRatio || 0.3;
  this._positionIndex = 0;
  
  // DOM elements
  this.$carouselContainer = (typeof config.carouselContainer !== 'undefined') ? $('#' + config.carouselContainer) : undefined;
  this.hasDescriptionContainer = typeof config.descriptionContainer !== 'undefined';
  this.$descriptionContainer = (this.hasDescriptionContainer) ? $('#' + config.descriptionContainer) : undefined;
  this.$previousButton = (typeof config.previousButton !== 'undefined') ? $('#' + config.previousButton) : undefined;
  this.$nextButton = (typeof config.nextButton !== 'undefined') ? $('#' + config.nextButton) : undefined;
  
  // set center point
  this.center(new SPITFIRE.Point(~~(this.$carouselContainer.width() * 0.5), ~~(this.$carouselContainer.height() * 0.5)));
  
  this.initStates();
  this.initHandlers();
};

SPITFIRE.UICarousel.superclass = SPITFIRE.State;
SPITFIRE.UICarousel.synthesizedProperties = [
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

SPITFIRE.UICarousel.prototype = {

  //--------------------------------------
  // Getters / Setters
  //--------------------------------------
  
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
      item.animate(newPos, this.center().y, z, scale, opacity, this._speed * Math.abs(delta));
    }
    
    this._positionIndex = value;
    
    this.trigger(new SPITFIRE.Event(SPITFIRE.Event.CHANGE));
  },
  
  //--------------------------------------
  // Event Handlers
  //--------------------------------------
  
  childChangeHandler: function(event) {
    this.callSuper(event);
    
    this.updateDescription();
  },
  
  imagesLoadedHandler: function(event) {
    this.positionItems();
    this.getChildByName(this.getDefaultChild()).browse();
  },

  //--------------------------------------
  // Methods
  //--------------------------------------
  
  initStates: function() {

    var sequentialTask = new SPITFIRE.SequentialTask();
    sequentialTask.bind(SPITFIRE.Event.COMPLETE, this.imagesLoadedHandler.context(this));
    
    var i, len, data, uid, state, item, $el;
    for (i = 0, len = this.data.length; i < len; i += 1) {
      data = this.data[i];
      uid = 'item' + (i + 1);
      
      state = new SPITFIRE.UICarouselItem(uid, data.imageUrl, i);
      this.$carouselContainer.append(state.$el);
      
      sequentialTask.addTask(state.loader);
      sequentialTask.addTask(new SPITFIRE.FunctionTask(this, this.initImage, state));

      this.addChild(state);
      this._items.push(state);
    }
    
    sequentialTask.start();
    
    if (this.data.length) {
      this.defaultChild(this.getChildren()[this._positionIndex].getName());
    }
  },
  
  initImage: function(state) {
    state.itemHeight(this.itemHeight());
  },
  
  initHandlers: function() {
    if (typeof this.$previousButton !== 'undefined') this.$previousButton.bind('click', $.proxy(this.previous, this));
    if (typeof this.$nextButton !== 'undefined') this.$nextButton.bind('click', $.proxy(this.next, this));
  },
  
  updateDescription: function() {
    if (!this.hasDescriptionContainer) return;
    
    var desc = this.data[this.getPositionIndex()].description;
    desc = (typeof desc != 'undefined') ? desc : '';

    this.$descriptionContainer.html(desc);
  },
  
  positionItems: function() {
    var rightIndex = this._positionIndex + 1,
        leftIndex = (this._positionIndex - 1 >= 0) ? this._positionIndex - 1 : this._items.length - 1,
        startLeft = leftIndex,
        startRight = rightIndex,
        xPos = this.getCenter().x,
        yPos = this.getCenter().y,
        centerItem = this.items()[this._positionIndex],
        rightXPos = xPos + this.itemDistance(),
        leftXPos = xPos - this.itemDistance(),
        rightItem, leftItem,
        count = 0,
        halfNumItems = Math.ceil((this._items.length - 1) * 0.5),
        opacity;
        
    this.centerIndex(Math.floor(this._items.length * 0.5));
    
    centerItem.displayObject.l(xPos);
    centerItem.displayObject.t(yPos);
    centerItem.$el.css('opacity', 1);
    centerItem.carouselIndex(this.centerIndex());

    while (count < halfNumItems) {
/*       log('left: ' + leftIndex + ' right: ' + rightIndex); */
      count++;
      opacity = (count > this.neighbors()) ? 0 : 1;
      rightItem = this._items[rightIndex];
      
      if (rightItem) {
        rightItem.displayObject.l(rightXPos);
        rightItem.displayObject.t(yPos);
        rightItem.carouselIndex(this.centerIndex() + count);
        rightItem.$el.css('opacity', opacity);
        rightXPos += this.itemDistance();
        rightIndex++;
        
        if (rightIndex >= this._items.length)
          rightIndex = 0;
      }
      
      leftItem = this._items[leftIndex];
      if (leftItem) {
        leftItem.displayObject.l(leftXPos);
        leftItem.displayObject.t(yPos);
        leftItem.carouselIndex(this.centerIndex() - count);
        leftItem.$el.css('opacity', opacity);
        
        leftXPos -= this.itemDistance();
        leftIndex--;
        
        if (leftIndex < 0)
          leftIndex = this._items.length - 1;
      }
    }
    
    this.startX(leftItem.displayObject.l());
  },
  
  previous: function() {
    var nextIndex = this._positionIndex - 1;
    nextIndex = (nextIndex < 0) ? this._items.length - 1 : nextIndex;
    this._items[nextIndex].browse();
  },
  
  next: function() {
    var nextIndex = this._positionIndex + 1;
    nextIndex = (nextIndex >= this._items.length) ? 0 : nextIndex;
    this._items[nextIndex].browse();
  }
};

SPITFIRE.Class(SPITFIRE.UICarousel);
