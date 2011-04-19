//--------------------------------------
// SPITFIRE.Rectangle
//--------------------------------------

SPITFIRE.Rectangle = function(x, y, width, height) {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.Rectangle');
  
  this.x(x);
  this.y(y);
  this.width(width);
  this.height(height);
};

SPITFIRE.Rectangle.superclass = SPITFIRE.Object;
SPITFIRE.Rectangle.synthesizedProperties = [
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

SPITFIRE.Rectangle.prototype = {
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
    return new SPITFIRE.Point(this.width(), this.height());
  },
  
  getTopLeft: function() {
    return new SPITFIRE.Point(this.top(), this.left());
  },
  
  getBottomRight: function() {
    return new SPITFIRE.Point(this.bottom(), this.right());
  },
  
  //--------------------------------------
  // Methods
  //--------------------------------------
  
  clone: function() {
    return new SPITFIRE.Rectangle(this.x(), this.y(), this.width(), this.height());
  },
  
  toString: function() {
    return '[' + this.qualifiedClassName() + ']';
  }
};

SPITFIRE.Class(SPITFIRE.Rectangle);