//--------------------------------------
// SPITFIRE.Rectangle
//--------------------------------------

SPITFIRE.Rectangle = function(x, y, width, height) {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.Rectangle');
  
  this.setX(x);
  this.setY(y);
  this.setWidth(width);
  this.setHeight(height);
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
  
  setTop: function(value) {
    throw new SPITFIRE.Error('read-only: cannot set top property');
  },
  
  getTop: function() {
    return this.getY();
  },
  
  setLeft: function(value) {
    throw new SPITFIRE.Error('read-only: cannot set left property');
  },
  
  getLeft: function() {
    return this.getX();
  },
  
  setRight: function(value) {
    throw new SPITFIRE.Error('read-only: cannot set right property');
  },
  
  getRight: function() {
    return this.getX() + this.getWidth();
  },
  
  setBottom: function(value) {
    throw new SPITFIRE.Error('read-only: cannot set bottom property');
  },
  
  getBottom: function() {
    return this.getY() + this.getHeight();
  },
  
  setSize: function(value) {
    throw new SPITFIRE.Error('read-only: cannot set size property');
  },
  
  getSize: function() {
    return new SPITFIRE.Point(this.getWidth(), this.getHeight());
  },
  
  setTopLeft: function(value) {
    throw new SPITFIRE.Error('read-only: cannot set topLeft property');
  },
  
  getTopLeft: function() {
    return new SPITFIRE.Point(this.getTop(), this.getLeft());
  },
  
  setBottomRight: function(value) {
    throw new SPITFIRE.Error('read-only: cannot set bottomRight property');
  },
  
  getBottomRight: function() {
    return new SPITFIRE.Point(this.getBottom(), this.getRight());
  },
  
  //--------------------------------------
  // Methods
  //--------------------------------------
  
  clone: function() {
    return new SPITFIRE.Rectangle(this.getX(), this.getY(), this.getWidth(), this.getHeight());
  },
  
  toString: function() {
    return '[' + this.getQualifiedClassName() + ']';
  }
};

SPITFIRE.Class(SPITFIRE.Rectangle);