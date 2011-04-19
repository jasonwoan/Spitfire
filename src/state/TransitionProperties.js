//--------------------------------------
// SPITFIRE.TransitionProperties
//--------------------------------------

SPITFIRE.TransitionProperties = function(locations, transitionName, showPreloader) {
  this.callSuper();
  this.locations(locations);
  this.transitionName(transitionName);
  this.showPreloader(showPreloader);
}

SPITFIRE.TransitionProperties.superclass = SPITFIRE.Object;
SPITFIRE.TransitionProperties.synthesizedProperties = ['locations', 'transitionName', 'showPreloader', 'currentState'];

SPITFIRE.TransitionProperties.prototype = {
  toString: function() {
    return this.transitionName();
  }
}

SPITFIRE.Class(SPITFIRE.TransitionProperties);