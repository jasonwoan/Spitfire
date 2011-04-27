//--------------------------------------
// SPITFIRE.DisplayState
//--------------------------------------

SPITFIRE.DisplayState = function(name, config) {
  this.callSuper(name);
  this.qualifiedClassName('SPITFIRE.DisplayState');
  
  var defaultConfig = {
    id: '',
    assets: {
      view: '',
      stylesheets: [],
      images: []
    }
  }
  
  var configuration = config || defaultConfig;
  this.config(configuration);
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
    
    if (configView && configView != '') {
      this.view(new SPITFIRE.JQueryAjaxTask(configView));
      sequentialTask.addTask(this.view());
    }
    
    // load stylesheets
    var configStylesheets = this.config().assets.stylesheets;
    
    if (configStylesheets.length > 0) {
      for (i = 0, len = configStylesheets.length; i < len; i += 1) {
      	var stylesheet = configStylesheets[i];
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
      	task = new SPITFIRE.JQueryAjaxTask(img);
      	this.images().push(task);
      	sequentialTask.addTask(task);
      }
    }
    
    sequentialTask.addTask(new SPITFIRE.FunctionTask(this, this.addDOMAssets));
    return sequentialTask;
  },
  
  getTransitionOut: function() {
    return new SPITFIRE.FunctionTask(this, this.cleanUp);
  },
  
  //--------------------------------------
  // Methods
  //--------------------------------------
  
  addDOMAssets: function() {
    
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
    
    this.setIsCached(true);
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

  toString: function() {
    return '[' + this.qualifiedClassName() + ']';
  }
};

SPITFIRE.Class(SPITFIRE.DisplayState);
