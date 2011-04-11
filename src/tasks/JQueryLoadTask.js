SPITFIRE.tasks = SPITFIRE.tasks || {};

//--------------------------------------
// SPITFIRE.tasks.JQueryLoadTask
//--------------------------------------

SPITFIRE.tasks.JQueryLoadTask = function(url, $target) {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.tasks.JQueryLoadTask');
  
  if (!url) throw new SPITFIRE.Error('a valid url must be specified');
  
  this.url(url);
  this.$target($target || $('body'));
};

SPITFIRE.tasks.JQueryLoadTask.superclass = SPITFIRE.tasks.Task;
SPITFIRE.tasks.JQueryLoadTask.synthesizedProperties = ['url', '$target'];

SPITFIRE.tasks.JQueryLoadTask.prototype = {
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

SPITFIRE.Class(SPITFIRE.tasks.JQueryLoadTask);
