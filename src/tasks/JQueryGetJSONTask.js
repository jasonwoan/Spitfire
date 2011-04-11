SPITFIRE.tasks = SPITFIRE.tasks || {};

//--------------------------------------
// SPITFIRE.tasks.JQueryGetJSONTask
//--------------------------------------

SPITFIRE.tasks.JQueryGetJSONTask = function(url, data) {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.tasks.JQueryGetJSONTask');    
  this.url(url);
  this.data(data);
};

SPITFIRE.tasks.JQueryGetJSONTask.superclass = SPITFIRE.tasks.Task;
SPITFIRE.tasks.JQueryGetJSONTask.synthesizedProperties = ['url', 'data', 'content'];

SPITFIRE.tasks.JQueryGetJSONTask.prototype = {
  
  //--------------------------------------
  // Event Handlers
  //--------------------------------------
  
  jsonHandler: function(data, textStatus) {
    switch (textStatus) {
      case 'success':
        this.content(data);
      break;
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

SPITFIRE.Class(SPITFIRE.tasks.JQueryGetJSONTask);