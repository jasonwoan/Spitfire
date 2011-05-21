/*global SPITFIRE, $*/

//--------------------------------------
// SPITFIRE.JQueryEffectTask
//--------------------------------------

SPITFIRE.JQueryEffectTask = function(target, effect) {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.JQueryEffectTask');
  
  var args = SPITFIRE.slice(arguments, 2, arguments.length - 1);
  
  if (!SPITFIRE.isFunction(target[effect])) {
    throw new SPITFIRE.Error('target does not support this effect');
  }
  
  this.target(target);
  this.effect(effect);
  this.args(args);
};

SPITFIRE.JQueryEffectTask.superclass = SPITFIRE.Task;
SPITFIRE.JQueryEffectTask.synthesizedProperties = ['target', 'effect', 'args'];

SPITFIRE.JQueryEffectTask.prototype = {

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

SPITFIRE.Class(SPITFIRE.JQueryEffectTask);