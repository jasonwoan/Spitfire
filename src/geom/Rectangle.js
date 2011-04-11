SPITFIRE.geom = SPITFIRE.geom || {};

//--------------------------------------
// SPITFIRE.geom.Rectangle
//--------------------------------------

SPITFIRE.geom.Rectangle = function(x, y, width, height) {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.geom.Rectangle');
  
  this.x(x);
  this.y(y);
  this.width(width);
  this.height(height);
};

SPITFIRE.geom.Rectangle.superclass = SPITFIRE.Object;
SPITFIRE.geom.Rectangle.synthesizedProperties = [
  'x',
  'y',
  'width',
  'height',
  'top',
  'left',
  'right',
  'bottom',
  'size',
  'bottomRight',
  'topLeft'
];

SPITFIRE.geom.Rectangle.prototype = {
  //--------------------------------------
  // Getters / Setters
  //--------------------------------------
  
  getTop: function() {
    return this.y();
  },
  
  getLeft: function() {
    return this.x();
  },
  
  getRight: function() {
    return this.x() + this.width();
  },
  
  getBottom: function() {
    return this.y() + this.height();
  },
  
  getSize: function() {
    return new SPITFIRE.geom.Point(this.width(), this.height());
  },
  
  getTopLeft: function() {
    return new SPITFIRE.geom.Point(this.top(), this.left());
  },
  
  getBottomRight: function() {
    return new SPITFIRE.geom.Point(this.bottom(), this.right());
  },
  
  //--------------------------------------
  // Methods
  //--------------------------------------
  
  clone: function() {
    return new SPITFIRE.geom.Rectangle(this.x(), this.y(), this.width(), this.height());
  },
  
  toString: function() {
    return '[' + this.qualifiedClassName() + ']';
  }
};

SPITFIRE.Class(SPITFIRE.geom.Rectangle);