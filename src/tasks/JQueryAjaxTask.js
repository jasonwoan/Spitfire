SPITFIRE.tasks = SPITFIRE.tasks || {};

//--------------------------------------
// SPITFIRE.tasks.JQueryAjaxTask
//--------------------------------------

SPITFIRE.tasks.JQueryAjaxTask = function(url, settings) {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.tasks.JQueryAjaxTask');
  this.url(url);
  this.settings(settings);
};

SPITFIRE.tasks.JQueryAjaxTask.superclass = SPITFIRE.tasks.Task;
SPITFIRE.tasks.JQueryAjaxTask.synthesizedProperties = ['url', 'settings', 'content'];

SPITFIRE.tasks.JQueryAjaxTask.prototype = {  
  //--------------------------------------
  // Event Handlers
  //--------------------------------------
  
  ajaxSuccessHandler: function(data, textStatus, jqXHR) {
    this.content(data);
    this.complete();
  },
  
  ajaxErrorHandler: function(jqXHR, textStatus, errorThrown) {
    if (this.debug()) {
      log(this + ' Error: could not load this file. textStatus=' + textStatus + ' errorThrown=' + errorThrown);
    }
    this.complete();
  },
  
  ajaxComplete: function(jqXHR, textStatus) {
    if (this.debug()) {
      log(this + ' Complete: textStatus=' + textStatus);
    }
  },
  
  //--------------------------------------
  // Methods
  //--------------------------------------
  
  start: function() {
    $.ajax(this.url(), this.settings())
      .success(this.ajaxSuccessHandler.context(this))
      .error(this.ajaxErrorHandler.context(this))
      .complete(this.ajaxComplete.context(this));
  },

  toString: function() {
    return '[' + this.qualifiedClassName() + ']';
  }
};

SPITFIRE.Class(SPITFIRE.tasks.JQueryAjaxTask);