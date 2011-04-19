//--------------------------------------
// Redirect
//--------------------------------------

SPITFIRE.Redirect = function(location, newLocation) {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.Redirect');
  this.location(location);
  this.newLocation(newLocation);
}

SPITFIRE.Redirect.superclass = SPITFIRE.Object;
SPITFIRE.Redirect.synthesizedProperties = ['location', 'newLocation'];

SPITFIRE.Class(SPITFIRE.Redirect);