/*global SPITFIRE, $*/

//--------------------------------------
// SPITFIRE.JQueryGetJSONTask
//--------------------------------------

SPITFIRE.JQueryGetJSONTask = function(url, data) {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.JQueryGetJSONTask');    
  this.url(url);
  this.data(data);
};

SPITFIRE.JQueryGetJSONTask.superclass = SPITFIRE.Task;
SPITFIRE.JQueryGetJSONTask.synthesizedProperties = ['url', 'data', 'content'];

SPITFIRE.JQueryGetJSONTask.prototype = {
  
  //--------------------------------------
  // Event Handlers
  //--------------------------------------
  
  jsonHandler: function(data, textStatus) {
    if (textStatus === 'success') {
      this.content(data);
    }
    
    this.complete();
  },

  //--------------------------------------
  // Methods
  //--------------------------------------
  
  start: function() {
    $.getJSON(this.url(), this.jsonHandler.context(this));
  },

  toString: function() {
    return '[' + this.qualifiedClassName() + ']';
  }
};

SPITFIRE.Class(SPITFIRE.JQueryGetJSONTask);