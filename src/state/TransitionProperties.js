SPITFIRE.state = SPITFIRE.state || {};

//--------------------------------------
// SPITFIRE.state.TransitionProperties
//--------------------------------------

SPITFIRE.state.TransitionProperties = function(locations, transitionName, showPreloader) {
  this.callSuper();
  this.locations(locations);
  this.transitionName(transitionName);
  this.showPreloader(showPreloader);
}

SPITFIRE.state.TransitionProperties.superclass = SPITFIRE.Object;
SPITFIRE.state.TransitionProperties.synthesizedProperties = ['locations', 'transitionName', 'showPreloader', 'currentState'];

SPITFIRE.state.TransitionProperties.prototype = {
  toString: function() {
    return this.transitionName();
  }
}

SPITFIRE.Class(SPITFIRE.state.TransitionProperties);