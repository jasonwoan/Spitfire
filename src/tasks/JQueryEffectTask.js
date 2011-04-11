SPITFIRE.tasks = SPITFIRE.tasks || {};

//--------------------------------------
// SPITFIRE.tasks.JQueryEffectTask
//--------------------------------------

SPITFIRE.tasks.JQueryEffectTask = function(target, effect) {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.tasks.JQueryEffectTask');
  
  var args = SPITFIRE.slice(arguments, 2, arguments.length - 1);
  
  if (!SPITFIRE.isFunction(target[effect])) {
    throw new SPITFIRE.Error('target does not support this effect');
  }
  
  this.target(target);
  this.effect(effect);
  this.args(args);
};

SPITFIRE.tasks.JQueryEffectTask.superclass = SPITFIRE.tasks.Task;
SPITFIRE.tasks.JQueryEffectTask.synthesizedProperties = ['target', 'effect', 'args'];

SPITFIRE.tasks.JQueryEffectTask.prototype = {

  //--------------------------------------
  // Event Handlers
  //--------------------------------------
  
  effectCompleteHandler: function() {
    this.complete();
  },

  //--------------------------------------
  // Methods
  //--------------------------------------
  
  start: function() {
    this.args().push($.proxy(this.effectCompleteHandler, this));
    this.target()[this.effect()].apply(this.target(), this.args());
  },

  toString: function() {
    return '[' + this.qualifiedClassName() + ']';
  }
};

SPITFIRE.Class(SPITFIRE.tasks.JQueryEffectTask);