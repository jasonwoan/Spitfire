//--------------------------------------
// Object
//--------------------------------------

SPITFIRE.Object = function() {
  this.setQualifiedClassName('SPITFIRE.Object');
};

SPITFIRE.Object.synthesizedProperties = ['qualifiedClassName'];

SPITFIRE.Object.prototype = {
  init: function() {
  
  }
}

SPITFIRE.Class(SPITFIRE.Object);