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
    this.decimalPercentage(percentage);
  } else {
    this.percentage(percentage);
  }
};

SPITFIRE.Percent.superclass = SPITFIRE.Object;
SPITFIRE.synthesizedProperties = ['percentage', 'decimalPercentage'];

SPITFIRE.prototype = {
  getPercentage: function() {
    return 100 * this._percent;
  },
  
  setPercentage: function(value) {
    this._percent = value * .01;
  },
  
  getDecimalPercentage: function() {
    return this._percent;
  },
  
  setDecimalPercentage: function(value) {
    this._percent = value;
  },
  
  equals: function(percent) {
    return this.decimalPercentage() == percent.decimalPercentage();
  },
  
  clone: function() {
    return new SPITFIRE.Percent(this.decimalPercentage());
  },
  
  valueOf: function() {
    return this.decimalPercentage();
  },
  
  toString: function() {
    return this.decimalPercentage().toString();
  }
};

SPITFIRE.Class(SPITFIRE.Percent);
