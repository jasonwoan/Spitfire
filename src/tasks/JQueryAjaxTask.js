//--------------------------------------
// SPITFIRE.JQueryAjaxTask
//--------------------------------------

SPITFIRE.JQueryAjaxTask = function(url, settings) {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.JQueryAjaxTask');
  this.url(url);
  this.settings(settings);
};

SPITFIRE.JQueryAjaxTask.superclass = SPITFIRE.Task;
SPITFIRE.JQueryAjaxTask.synthesizedProperties = ['url', 'settings', 'content'];

SPITFIRE.JQueryAjaxTask.prototype = {  
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
    return '[' + this.qualifiedClassName() + '] url:' + this.url();
  }
};

SPITFIRE.Class(SPITFIRE.JQueryAjaxTask);