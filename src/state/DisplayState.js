//--------------------------------------
// SPITFIRE.DisplayState
//--------------------------------------

SPITFIRE.DisplayState = function(name, config, cache) {
  this.callSuper(name);
  this.qualifiedClassName('SPITFIRE.DisplayState');
  
  // An array of cached assets
  this.cache = cache || [];
  
  var defaultConfig = {
    id: '',
    trackingPageId: '',
    assets: {
      view: '',
      stylesheets: [],
      images: []
    }
  }
  
  var configuration = config || defaultConfig;
  this.setConfig(configuration);
  this.stylesheets([]);
  this.images([]);
  this._addedDOMAssets = [];
  this._isCached = false;
};

SPITFIRE.DisplayState.superclass = SPITFIRE.State;
SPITFIRE.DisplayState.synthesizedProperties = [
  'view',
  'stylesheets',
  'images',
  'config',
  'isCached'
];

SPITFIRE.DisplayState.prototype = {

  //--------------------------------------
  // Getters / Setters
  //--------------------------------------
  
  getLoadIn: function() {
    // don't load if already cached
    if (this.getIsCached()) return undefined;
    
    var sequentialTask = new SPITFIRE.SequentialTask(),
        i, len, task;
    
    // load view
    var configView = this.config().assets.view;
    
    if (configView && configView != '' && !this.checkIsCached(configView)) {
      this.cache.push(configView);
      this.view(new SPITFIRE.JQueryAjaxTask(configView));
      sequentialTask.addTask(this.view());

    }
    
    // load stylesheets
    var configStylesheets = this.config().assets.stylesheets;
    
    if (configStylesheets.length > 0) {
      for (i = 0, len = configStylesheets.length; i < len; i += 1) {
      	var stylesheet = configStylesheets[i];
				if (this.checkIsCached(stylesheet))
					continue;
				this.cache.push(stylesheet);
      	task = new SPITFIRE.JQueryAjaxTask(stylesheet);
      	this.stylesheets().push(task);
      	sequentialTask.addTask(task);
      }
    }
    
    // load images
    var configImages = this.config().assets.images;
    if (configImages.length > 0) {
      for (i = 0, len = configImages.length; i < len; i += 1) {
      	var img = configImages[i];
				if (this.checkIsCached(img))
					continue;
				this.cache.push(img);
      	task = new SPITFIRE.JQueryAjaxTask(img);
      	this.images().push(task);
      	sequentialTask.addTask(task);
      }
    }
    
    sequentialTask.addTask(new SPITFIRE.FunctionTask(this, this.addDOMAssets));
    return sequentialTask;
  },
  
  getTransitionIn: function() {
    return new SPITFIRE.FunctionTask(this, this.trackPage);
  },
  
  getTransitionOut: function() {
    return new SPITFIRE.FunctionTask(this, this.cleanUp);
  },
  
  //--------------------------------------
  // Methods
  //--------------------------------------
  
  addDOMAssets: function() {
    this.setIsCached(true);
    
    // add stylesheets to DOM
    var i, len, $obj, style, rules,
        head = document.getElementsByTagName('head')[0];
    
    if (this.stylesheets().length > 0) {
      for (i = 0, len = this.stylesheets().length; i < len; i += 1) {
      	style = document.createElement('style');
      	style.type = 'text/css';
      	rules = document.createTextNode(this.stylesheets()[i].content());
      	
      	if (style.styleSheet) {
          style.styleSheet.cssText = rules.nodeValue;
        } else {
          style.appendChild(rules);
        }
        
      	head.appendChild(style);
        this._addedDOMAssets.push(style);
      }
    }
    
    // add view to DOM
    if (this.view()) {
      $obj = $(this.view().content()).appendTo('body');
      this._addedDOMAssets.push($obj);
    }
  },
  
  checkIsCached: function(asset) {
    var i, len;
    for (i = 0, len = this.cache.length; i < len; i += 1) {
      if (this.cache[i] === asset) {
	return true;
      }
    }
    
    return false;
  },
  
  removeDOMAssets: function() {
    while (this._addedDOMAssets.length > 0) {
      // check for jQuery objects
      var obj = this._addedDOMAssets[0];
      if (typeof obj.remove === 'function') {
        obj.remove();
      } else {
        // raw js
      }
      this._addedDOMAssets.shift();
    }
  },
  
  cleanUp: function() {

  },
  
  trackPage: function() {
    var trackingPageId = this.getConfig().trackingPageId;
    if (typeof trackingPageId !== 'undefined' && trackingPageId !== '')
      SPITFIRE.trackPage(trackingPageId);
  },

  toString: function() {
    return '[' + this.qualifiedClassName() + ']';
  }
};

SPITFIRE.Class(SPITFIRE.DisplayState);
