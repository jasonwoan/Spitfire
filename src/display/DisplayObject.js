SPITFIRE.display = SPITFIRE.display || {};

//--------------------------------------
// SPITFIRE.display.DisplayObject
//--------------------------------------

SPITFIRE.display.DisplayObject = function() {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.display.DisplayObject');
  this._scaleX = 1;
  this._scaleY = 1;
  this._scale = 1;
  this._placeholderProperties = [];
};

SPITFIRE.display.DisplayObject.superclass = SPITFIRE.Object;
SPITFIRE.display.DisplayObject.synthesizedProperties = [
  '$this',
  'l',
  't',
  'w',
  'h',
  'scaleX',
  'scaleY',
  'scale',
  'rect',
];

SPITFIRE.display.DisplayObject.prototype = {

  //--------------------------------------
  // Getters / Setters
  //--------------------------------------
  
  setL: function(value) {
    this.$this().css('left', value);
  },
  
  getL: function() {
    var flt = parseFloat(this.$this().css('left'));
    return (flt) ? flt : 0;
  },
  
  setT: function(value) {
    this.$this().css('top', value);
  },
  
  getT: function() {
    var flt = parseFloat(this.$this().css('top'));
    return (flt) ? flt : 0;
  },
  
  getW: function() {
    return (this._w) ? this._w : this.$this().width();
  },
  
  setW: function(value) {
    this._w = value;
    this.$this().width(this.scaleX() * value);
  },

  getH: function() {
    return (this._h) ? this._h : this.$this().height();
  },
  
  setH: function(value) {
    this._h = value;
    this.$this().height(this.scaleY() * value);
  },
  
  getScale: function() {
    return (this._scaleX == this._scaleY) ? this._scaleX : undefined;
  },
  
  setScale: function(value) {
    this._scale = value;
    this.scaleX(value);
    this.scaleY(value);
  },
  
  setScaleX: function(value) {
    this._scaleX = value;
    this.w(this.w());
  },
  
  setScaleY: function(value) {
    this._scaleY = value;
    this.h(this.h());
  },
  
  getRect: function() {
    return new SPITFIRE.geom.Rectangle(this.l(), this.t(), this.w(), this.h());
  },
  
  setRect: function(value) {
    this.l(value.x());
    this.t(value.y());
    this.w(value.width());
    this.h(value.height());
  },

  //--------------------------------------
  // Methods
  //--------------------------------------
  
  init: function() {
    this.$this($(this));
  },
  
  animate: function(properties, options) {
    
    // handle custom properties
    for (var prop in properties) {
      if (SPITFIRE.isSynthesizedProperty(prop, SPITFIRE.display.DisplayObject)) {
        // create a placeholder property to tween
        var placeHolderName = prop + 'AnimationValue';
        properties[placeHolderName] = properties[prop];
        delete properties[prop];
        
        // create the same placeholder property on this object
        // and set it to its current value
        this[placeHolderName] = this[prop]();
        this._placeholderProperties.push(placeHolderName);
      }
    }
    
    // save any provided step function
    if (options.step) {
      this.providedAnimationStep = options.step;
    }
    options.step = this.animationStep;
    
    // save any provided complete function
    if (options.complete) {
      this.providedAnimationComplete = options.complete;
    }
    options.complete = this.animationComplete;
    
    this.$this().animate(properties, options);
  },
  
  animationStep: function(now, fx) {
    // animate custom properties
    var pattern = /AnimationValue/;
    if (fx.prop.search(pattern) != -1) {
      this[fx.prop.replace(pattern, '')](now);
    }
    
    // call original step
    if (this.providedAnimationStep) {
      this.providedAnimationStep(now, fx);
    }
  },
  
  animationComplete: function() {
    // call provided complete function
    if (this.providedAnimationComplete)
      this.providedAnimationComplete();
    
    // cleanup
    delete this.providedAnimationComplete;
    delete this.animationStep;
    
    while (this._placeholderProperties.length > 0) {
      delete this[this._placeholderProperties[0]];
      this._placeholderProperties.shift();
    }
  },

  toString: function() {
    return '[' + this.qualifiedClassName() + ']';
  }
};

SPITFIRE.Class(SPITFIRE.display.DisplayObject);