/*global SPITFIRE*/

//--------------------------------------
// SPITFIRE.Point
//--------------------------------------

SPITFIRE.Point = function(x, y) {
  this.callSuper();
  this.setQualifiedClassName('SPITFIRE.Point');
  this.x = x;
  this.y = y;
};

SPITFIRE.Point.superclass = SPITFIRE.Object;

SPITFIRE.Point.prototype = {  
  //--------------------------------------
  // Methods
  //--------------------------------------

  toString: function() {
    return '[' + this.getQualifiedClassName() + '] x:' + this.x + ' y:' + this.y;
  }
};

SPITFIRE.Class(SPITFIRE.Point);