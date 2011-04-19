//--------------------------------------
// SPITFIRE.JQueryLoadTask
//--------------------------------------

SPITFIRE.JQueryLoadTask = function(url, $target) {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.JQueryLoadTask');
  
  if (!url) throw new SPITFIRE.Error('a valid url must be specified');
  
  this.url(url);
  this.$target($target || $('body'));
};

SPITFIRE.JQueryLoadTask.superclass = SPITFIRE.Task;
SPITFIRE.JQueryLoadTask.synthesizedProperties = ['url', '$target'];

SPITFIRE.JQueryLoadTask.prototype = {
  //--------------------------------------
  // Event Handlers
  //--------------------------------------
  
  loadHandler: function(response, status, xhr) {
    if (status == 'error') {
      log(this + ' Error: could not load this file');
    }
    
    this.complete();
  },

  //--------------------------------------
  // Methods
  //--------------------------------------
  
  start: function() {
    this.$target().load(this.url(), this.loadHandler.context(this));
  },

  toString: function() {
    return '[' + this.qualifiedClassName() + ' url=' + this.url() + ']';
  }
};

SPITFIRE.Class(SPITFIRE.JQueryLoadTask);
