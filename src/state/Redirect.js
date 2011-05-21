/*global SPITFIRE*/

//--------------------------------------
// Redirect
//--------------------------------------

SPITFIRE.Redirect = function(location, newLocation) {
  this.callSuper();
  this.setQualifiedClassName('SPITFIRE.Redirect');
  this.setLocation(location);
  this.setNewLocation(newLocation);
};

SPITFIRE.Redirect.superclass = SPITFIRE.Object;
SPITFIRE.Redirect.synthesizedProperties = ['location', 'newLocation'];

SPITFIRE.Class(SPITFIRE.Redirect);