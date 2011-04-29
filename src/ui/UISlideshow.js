//--------------------------------------
// SPITFIRE.UISlideshow
//--------------------------------------

SPITFIRE.UISlideshow = function(config) {
  config.name = config.name || 'slideshow';
  this.config = config;
  
  this.callSuper(config.name);
  this.setQualifiedClassName('SPITFIRE.UISlideshow');
  
  // validate configuration
  if (typeof config === 'undefined' ||
      typeof config.imageContainer === 'undefined') {
    throw new SPITFIRE.Error(this.toString() + ' is misconfigured');    
  }
  
  this.data = config.data || [];
  this.$imageContainer = $('#' + config.imageContainer);
  this._currentIndex = 0;
  
  this.hasDescriptionContainer = typeof config.descriptionContainer !== 'undefined';
  this.$descriptionContainer = (this.hasDescriptionContainer) ? $('#' + config.descriptionContainer) : undefined;
  this.$previousButton = (typeof config.previousButton !== 'undefined') ? $('#' + config.previousButton) : undefined;
  this.$nextButton = (typeof config.nextButton !== 'undefined') ? $('#' + config.nextButton) : undefined;
  this.$previousPageButton = (typeof config.previousPageButton !== 'undefined') ? $('#' + config.previousPageButton) : undefined;
  this.$nextPageButton = (typeof config.nextPageButton !== 'undefined') ? $('#' + config.nextPageButton) : undefined;
  
  this.hasLoadingIndicator = (typeof config.loadingIndicator !== 'undefined');
  this.$loadingIndicator = (this.hasLoadingIndicator) ? $('#' + config.loadingIndicator) : undefined;
  if (this.hasLoadingIndicator) this.$loadingIndicator.hide();
  
  this.hasDrawer = (typeof config.drawer !== 'undefined');
  this.$drawer = (this.hasDrawer) ? $('#' + config.drawer) : undefined;
  
  this.initStates();
  this.initDrawer();
  this.initHandlers();
};

SPITFIRE.UISlideshow.superclass = SPITFIRE.State;
SPITFIRE.UISlideshow.synthesizedProperties = [
  'currentIndex',
  'currentPageIndex'
];

SPITFIRE.UISlideshow.prototype = {

  //--------------------------------------
  // Getters / Setters
  //--------------------------------------
  
  setCurrentIndex: function(value) {
    this._currentIndex = value;
    this.states[this._currentIndex].browse();
  },
  
  setCurrentPageIndex: function(value) {
    if (this._currentPageIndex === value) return;
    this._currentPageIndex = value;
    
    // move to current page
    var xPos = -1 * this._currentPageIndex * (this._drawerThumbWidth + this._drawerGutter) * this._drawerThumbsPerPage;
    
    this.$drawer.animate({left: xPos}, {duration: 600, queue: false});
  },

  //--------------------------------------
  // Event Handlers
  //--------------------------------------
  
  childChangeHandler: function(event) {
    this.callSuper(event);
    
    this.updateDrawer();
    this.updateDescription();
  },
  
  thumbsLoadedHandler: function(event) {
    
  },
  
  thumbClickHandler: function(event) {
    this.setCurrentIndex(event.target.index);
  },

  //--------------------------------------
  // Methods
  //--------------------------------------
  
  initStates: function() {
    this.states = [];
    
    var i, len, item, uid, state;
    for (i = 0, len = this.data.length; i < len; i += 1) {
      item = this.data[i];
      uid = 'image' + (i + 1);
      
      state = new SPITFIRE.UISlideshowItem(uid, item.imageUrl);
      
      // add image to container
      this.$imageContainer.append(state.loader.get$content());
      
      this.addChild(state);
      this.states.push(state);
    }
    
    if (this.data.length) {
      this.defaultChild(this.getChildren()[this._currentIndex].getName());
    }
  },
  
  initDrawer: function() {
    if (!this.hasDrawer) return;
    
    this._drawerItemX = 0;
    this._drawerThumbsPerPage = this.config.drawerThumbsPerPage || 10;
    this._drawerGutter = this.config.drawerGutter || 0;
    this._drawerThumbWidth = this.config.drawerThumbWidth || 100;
    this._$thumbs = [];
    this._numPages = Math.ceil(this.data.length / this._drawerThumbsPerPage);
    var sequentialTask = new SPITFIRE.SequentialTask();
    sequentialTask.bind(SPITFIRE.Event.COMPLETE, this.thumbsLoadedHandler.context(this));
    
    // load thumbnails and add them to drawer
    var i, len, item, thumb, $el;
    for (i = 0, len = this.data.length; i < len; i += 1) {
      item = this.data[i];
      thumb = new SPITFIRE.JQueryImageLoaderTask(item.thumbnailUrl);
      $el = thumb.get$content();
      $el.hide();
      $el[0].index = i;
      $el.bind('click', $.proxy(this.thumbClickHandler, this));
      this.$drawer.append($el);
      this._$thumbs.push($el);
      sequentialTask.addTask(thumb);
      sequentialTask.addTask(new SPITFIRE.FunctionTask(this, this.positionThumb, $el));
    }
    
    sequentialTask.start();
  },
  
  initHandlers: function() {
    if (typeof this.$previousButton !== 'undefined') this.$previousButton.bind('click', $.proxy(this.previousImage, this));
    if (typeof this.$nextButton !== 'undefined') this.$nextButton.bind('click', $.proxy(this.nextImage, this));
    if (typeof this.$previousPageButton !== 'undefined') this.$previousPageButton.bind('click', $.proxy(this.previousPage, this));
    if (typeof this.$nextPageButton !== 'undefined') this.$nextPageButton.bind('click', $.proxy(this.nextPage, this));
  },
  
  positionThumb: function($el) {
    $el.css('left', this._drawerItemX);
    this._drawerItemX += this._drawerThumbWidth + this._drawerGutter;
    $el.show();
  },
  
  previousImage: function() {
    var currIndex = this.getCurrentIndex();
    currIndex--;
    currIndex = (currIndex < 0) ? this.states.length - 1 : currIndex;
    
    this.setCurrentIndex(currIndex);
  },
  
  nextImage: function() {
    var currIndex = this.getCurrentIndex();
    currIndex++;
    currIndex = (currIndex >= this.states.length) ? 0 : currIndex;
    
    this.setCurrentIndex(currIndex);
  },
  
  previousPage: function() {
    var currPageIndex = this.getCurrentPageIndex();
    currPageIndex--;
    currPageIndex = (currPageIndex < 0) ? this._numPages - 1 : currPageIndex;
    this.setCurrentPageIndex(currPageIndex);
  },
  
  nextPage: function() {
    var currPageIndex = this.getCurrentPageIndex();
    currPageIndex++;
    currPageIndex = (currPageIndex >= this._numPages) ? 0 : currPageIndex;
    
    this.setCurrentPageIndex(currPageIndex);
  },
  
  updateDrawer: function() {
    if (!this.hasDrawer) return;
  
    var i, len, $thumb;
    for (i = 0, len = this._$thumbs.length; i < len; i += 1) {
      var $thumb = this._$thumbs[i];
      
      if (i === this.getCurrentIndex()) {
        $thumb.addClass('selected');
      } else {
        $thumb.removeClass('selected');
      }
    }
    
    // set the correct page
    var pageIndex = ~~ (this.getCurrentIndex() / this._drawerThumbsPerPage);
    this.setCurrentPageIndex(pageIndex);
  },
  
  updateDescription: function() {
    if (!this.hasDescriptionContainer) return;
    
    var desc = this.data[this.getCurrentIndex()].description;
    desc = (typeof desc != 'undefined') ? desc : '';

    this.$descriptionContainer.html(desc);
  }
};

SPITFIRE.Class(SPITFIRE.UISlideshow);
