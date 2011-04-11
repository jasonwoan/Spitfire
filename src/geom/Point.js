SPITFIRE.geom = SPITFIRE.geom || {};

//--------------------------------------
// SPITFIRE.geom.Point
//--------------------------------------

SPITFIRE.geom.Point = function(x, y) {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.geom.Point');
  this.x = x;
  this.y = y;
};

SPITFIRE.geom.Point.superclass = SPITFIRE.Object;

SPITFIRE.geom.Point.prototype = {  
  //--------------------------------------
  // Methods
  //--------------------------------------

  toString: function() {
    return '[' + this.qualifiedClassName() + ']';
  }
};

SPITFIRE.Class(SPITFIRE.geom.Point);