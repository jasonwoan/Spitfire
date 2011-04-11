SPITFIRE.tasks = SPITFIRE.tasks || {};

//--------------------------------------
// SPITFIRE.tasks.JQueryImageLoaderTask
//--------------------------------------

SPITFIRE.tasks.JQueryImageLoaderTask = function(url) {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.tasks.JQueryImageLoaderTask');
  
  this.url(url);
  this.content(new Image());
  this.$content($(this.content()));
  
  this.$content()
    .load(this.completeHandler.context(this))
    .error(this.errorHandler.context(this));
};

SPITFIRE.tasks.JQueryImageLoaderTask.superclass = SPITFIRE.tasks.Task;
SPITFIRE.tasks.JQueryImageLoaderTask.synthesizedProperties = ['url', 'content', '$content'];

SPITFIRE.tasks.JQueryImageLoaderTask.prototype = {

  //--------------------------------------
  // Event Handlers
  //--------------------------------------
  
  completeHandler: function() {
    this.complete();
  },
  
  errorHandler: function() {
    if (this.debug()) {
      log(this + ' Error: could not load this file.');
    }
    this.complete();
  },
  
  //--------------------------------------
  // Methods
  //--------------------------------------
  
  start: function() {
    this.$content().attr('src', this.url());
  },

  toString: function() {
    return '[' + this.qualifiedClassName() + ' url=' + this.url() + ']';
  }
};

SPITFIRE.Class(SPITFIRE.tasks.JQueryImageLoaderTask);