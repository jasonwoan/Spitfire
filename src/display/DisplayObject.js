//--------------------------------------
// SPITFIRE.DisplayObject
//--------------------------------------

SPITFIRE.DisplayObject = function() {
  this.callSuper();
  this.setQualifiedClassName('SPITFIRE.DisplayObject');
  this._scaleX = 1;
  this._scaleY = 1;
  this._scale = 1;
  this._placeholderProperties = [];
  this._z = 1;
};

SPITFIRE.DisplayObject.superclass = SPITFIRE.EventDispatcher;
SPITFIRE.DisplayObject.synthesizedProperties = [
  '$this',
  'l',
  't',
  'w',
  'h',
  'scaleX',
  'scaleY',
  'scale',
  'rect',
  'z'
];

SPITFIRE.DisplayObject.prototype = {

  //--------------------------------------
  // Getters / Setters
  //--------------------------------------
  
  setL: function(value) {
    this.get$this().css('left', value);
  },
  
  getL: function() {
    var flt = (this.style.left) ? parseFloat(this.style.left) : parseFloat(this.get$this().css('left'));
    return flt || 0;
  },
  
  setT: function(value) {
    this.get$this().css('top', value);
  },
  
  getT: function() {
    var flt = (this.style.top) ? parseFloat(this.style.top) : parseFloat(this.get$this().css('top'));
    return flt || 0;
  },
  
  getW: function() {
    return (this._w) ? this._w * this._scaleX : this.get$this().width();
  },
  
  setW: function(value) {
    this._w = value;
    this.get$this().width(this._w * this._scaleX);
  },

  getH: function() {
    return (this._h) ? this._h * this._scaleY : this.get$this().height();
  },
  
  setH: function(value) {
    this._h = value;
    this.get$this().height(this._h * this._scaleY);
  },
  
  getScale: function() {
    return (this._scaleX == this._scaleY) ? this._scaleX : undefined;
  },
  
  setScale: function(value) {
    this._scale = value;
    this.setScaleX(value);
    this.setScaleY(value);
  },
  
  setScaleX: function(value) {
    this._scaleX = value;
    this.setW(this._w);
  },
  
  setScaleY: function(value) {
    this._scaleY = value;
    this.setH(this._h);
  },
  
  getRect: function() {
    return new SPITFIRE.Rectangle(this.getL(), this.getT(), this.getW(), this.getH());
  },
  
  setRect: function(value) {
    this.setL(value.getX());
    this.setT(value.getY());
    this.setW(value.getWidth());
    this.setH(value.getHeight());
  },
  
  setZ: function(value) {
    this._z = value >> 0;
    this.get$this().css('z-index', this._z);
  },
  
  //--------------------------------------
  // Methods
  //--------------------------------------
  
  init: function() {
    this.set$this($(this));
  },
  
  animate: function(properties, options) {
    
    // handle custom properties
    for (var prop in properties) {
      if (SPITFIRE.isSynthesizedProperty(prop, SPITFIRE.DisplayObject)) {
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
    options.step = this.animationStep.context(this);
    
    // save any provided complete function
    if (options.complete) {
      this.providedAnimationComplete = options.complete;
    }
    options.complete = this.animationComplete.context(this);
    
    this.get$this().animate(properties, options);
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
    delete this.providedAnimationStep;
    
    while (this._placeholderProperties.length > 0) {
      delete this[this._placeholderProperties[0]];
      this._placeholderProperties.shift();
    }
  },

  toString: function() {
    return '[' + this.qualifiedClassName() + ']';
  }
};

SPITFIRE.Class(SPITFIRE.DisplayObject);