SPITFIRE.state = SPITFIRE.state || {};

//--------------------------------------
// Redirect
//--------------------------------------

SPITFIRE.state.Redirect = function(location, newLocation) {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.state.Redirect');
  this.location(location);
  this.newLocation(newLocation);
}

SPITFIRE.state.Redirect.superclass = SPITFIRE.Object;
SPITFIRE.state.Redirect.synthesizedProperties = ['location', 'newLocation'];

SPITFIRE.Class(SPITFIRE.state.Redirect);