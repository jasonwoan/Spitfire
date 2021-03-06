/*global SPITFIRE, $, window*/

//--------------------------------------
// SPITFIRE.UISlideshowItem
//--------------------------------------

SPITFIRE.UISlideshowItem = function(name, url, disableContextMenu) {
  disableContextMenu = disableContextMenu || false;
  this.callSuper(name);
  this.setQualifiedClassName('SPITFIRE.UISlideshowItem');
  
  this.url = url;
  this.loader = new SPITFIRE.JQueryImageLoaderTask(this.url);
  this.loader.get$content().hide();
  
  if (disableContextMenu) {
    this.loader.bind('contextmenu', function(event) {
      event = event || window.event;
      if (event.stopPropagation) {
          event.stopPropagation();
      }
    
      event.cancelBubble = true;
      return false;
    });
  }
};

SPITFIRE.UISlideshowItem.superclass = SPITFIRE.State;
SPITFIRE.UISlideshowItem.synthesizedProperties = [];

SPITFIRE.UISlideshowItem.prototype = {

  //--------------------------------------
  // Getters / Setters
  //--------------------------------------

  getLoadIn: function() {
    return new SPITFIRE.FunctionTask(this, this.loadImage);
  },
  
  getTransitionIn: function() {
    return new SPITFIRE.FunctionTask(this, this.transitionIn);
  },
  
  getTransitionOut: function() {
    return new SPITFIRE.FunctionTask(this, this.transitionOut);
  },
  
  //--------------------------------------
  // Methods
  //--------------------------------------
  
  loadImage: function() {
    this.loader.start();
  },
  
  transitionIn: function() {
    this.loader.get$content().fadeIn();
  },
  
  transitionOut: function() {
    this.loader.get$content().fadeOut();
  }
};

SPITFIRE.Class(SPITFIRE.UISlideshowItem);
