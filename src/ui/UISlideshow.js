//--------------------------------------
// SPITFIRE.UISlideshow
//--------------------------------------

SPITFIRE.UISlideshow = function(config) {
  this.callSuper();
  this.setQualifiedClassName('SPITFIRE.UISlideshow');
  
  // validate configuration
  if (typeof config === 'undefined' ||
      typeof config.imageContainer === 'undefined') {
    throw new SPITFIRE.Error(this.toString() + ' is misconfigured');    
  }
  
  this.data = config.data || [];
  this.$imageContainer = $('#' + config.imageContainer);
  
  this.$descriptionContainer = (typeof config.descriptionContainer !== 'undefined') ? $('#' + config.descriptionContainer) : undefined;
  this.$previousButton = (typeof config.previousButton !== 'undefined') ? $('#' + config.previousButton) : undefined;
  this.$nextButton = (typeof config.nextButton !== 'undefined') ? $('#' + config.nextButton) : undefined;
  this.$previousPageButton = (typeof config.previousPageButton !== 'undefined') ? $('#' + config.previousPageButton) : undefined;
  this.$nextPageButton = (typeof config.nextPageButton !== 'undefined') ? $('#' + config.nextPageButton) : undefined;
  
  this.hasLoadingIndicator = (typeof config.loadingIndicator !== 'undefined');
  this.$loadingIndicator = (this.hasLoadingIndicator) ? $('#' + config.loadingIndicator) : undefined;
  if (this.hasLoadingIndicator) this.$loadingIndicator.hide();
  
  this.hasDrawer = (typeof config.drawer !== 'undefined');
  this.$drawer = (this.hasDrawer) ? $('#' + config.drawer) : undefined;
  
  this.tree = new SPITFIRE.State('tree');
  this.setTree(this.tree);
  
  this.initStates();
  this.initDrawer();
  
  // show default image
  this.tree.browse();
};

SPITFIRE.UISlideshow.superclass = SPITFIRE.StateManager;

SPITFIRE.UISlideshow.prototype = {

  //--------------------------------------
  // Event Handlers
  //--------------------------------------
  
  thumbsLoadedHandler: function(event) {
    
  },
  
  thumbClickHandler: function(event) {
    this.states[event.target.index].browse();
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
      
      this.tree.addChild(state);
      this.states.push(state);
    }
    
    if (this.data.length) {
      this.tree.defaultChild(this.tree.getChildren()[0].getName());
    }
  },
  
  initDrawer: function() {
    if (!this.hasDrawer) return;
    
    this.thumbs = [];
    var sequentialTask = new SPITFIRE.SequentialTask();
    sequentialTask.bind(SPITFIRE.Event.COMPLETE, this.thumbsLoadedHandler.context(this));
    
    // load thumbnails and add them to drawer
    var i, len, item, thumb, $el;
    for (i = 0, len = this.data.length; i < len; i += 1) {
      item = this.data[i];
      thumb = new SPITFIRE.JQueryImageLoaderTask(item.thumbnailUrl);
      $el = thumb.get$content();
      $el[0].index = i;
      $el.bind('click', $.proxy(this.thumbClickHandler, this));
      this.$drawer.append($el);
      this.thumbs.push(thumb);
      sequentialTask.addTask(thumb);
    }
    
    sequentialTask.start();
  }
};

SPITFIRE.Class(SPITFIRE.UISlideshow);
