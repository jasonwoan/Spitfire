/*global SPITFIRE*/

//--------------------------------------
// Percent
//--------------------------------------
// Port of org.casalib.math.Percent from CASA lib for ActionScript 3.0
// http://casalib.org/

SPITFIRE.Percent = function(percentage, isDecimalPercentage) {
  this.callSuper();
  
  percentage = isDecimalPercentage || 0;
  isDecimalPercentage = isDecimalPercentage || true;
  
  if (isDecimalPercentage) {
    this.setDecimalPercentage(percentage);
  } else {
    this.setPercentage(percentage);
  }
};

SPITFIRE.Percent.superclass = SPITFIRE.Object;
SPITFIRE.synthesizedProperties = ['percentage', 'decimalPercentage'];

SPITFIRE.prototype = {
  getPercentage: function() {
    return 100 * this._percent;
  },
  
  setPercentage: function(value) {
    this._percent = value * 0.01;
  },
  
  getDecimalPercentage: function() {
    return this._percent;
  },
  
  setDecimalPercentage: function(value) {
    this._percent = value;
  },
  
  equals: function(percent) {
    return this.getDecimalPercentage() === percent.getDecimalPercentage();
  },
  
  clone: function() {
    return new SPITFIRE.Percent(this.getDecimalPercentage());
  },
  
  valueOf: function() {
    return this.getDecimalPercentage();
  },
  
  toString: function() {
    return this.getDecimalPercentage().toString();
  }
};

SPITFIRE.Class(SPITFIRE.Percent);
