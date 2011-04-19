//--------------------------------------
// SPITFIRE.Point
//--------------------------------------

SPITFIRE.Point = function(x, y) {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.Point');
  this.x = x;
  this.y = y;
};

SPITFIRE.Point.superclass = SPITFIRE.Object;

SPITFIRE.Point.prototype = {  
  //--------------------------------------
  // Methods
  //--------------------------------------

  toString: function() {
    return '[' + this.qualifiedClassName() + ']';
  }
};

SPITFIRE.Class(SPITFIRE.Point);