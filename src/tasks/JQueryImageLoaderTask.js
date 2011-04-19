//--------------------------------------
// SPITFIRE.JQueryImageLoaderTask
//--------------------------------------

SPITFIRE.JQueryImageLoaderTask = function(url) {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.JQueryImageLoaderTask');
  
  this.url(url);
  this.content(new Image());
  this.$content($(this.content()));
  
  this.$content()
    .load(this.completeHandler.context(this))
    .error(this.errorHandler.context(this));
};

SPITFIRE.JQueryImageLoaderTask.superclass = SPITFIRE.Task;
SPITFIRE.JQueryImageLoaderTask.synthesizedProperties = ['url', 'content', '$content'];

SPITFIRE.JQueryImageLoaderTask.prototype = {

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

SPITFIRE.Class(SPITFIRE.JQueryImageLoaderTask);