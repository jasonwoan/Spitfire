var TCD = TCD || {};

var $s = $s || TCD;

TCD.browser = {  
  Opera: window.opera ? true : false,
  IE: document.all && !this.Opera ? true : false,
  IE6: this.IE && typeof(window.XMLHttpRequest) == "undefined" ? true : false,
  IE8: this.IE && typeof(document.querySelectorAll) != "undefined" ? true : false,
  IE7: this.IE && ! this.IE6 && !this.IE8 ? true : false,
  WebKit: /WebKit/i.test(navigator.userAgent) ? true : false,
  iPhone: /iPhone|iPod/i.test(navigator.userAgent)? true : false,
  Chrome: /Chrome/i.test(navigator.userAgent) ? true : false,
  Safari: /Safari/i.test(navigator.userAgent) && !this.Chrome ? true : false,
  Konqueror: navigator.vendor == "KDE" ? true : false,
  Konqueror4: this.Konqueror && /native code/.test(document.getElementsByClassName) ? true : false,
  Gecko: !this.WebKit && navigator.product == "Gecko" ? true : false,
  Gecko19: this.Gecko && Array.reduce ? true : false
};

TCD.isArray = function(obj) {
  return typeof obj === 'object' && obj.length;
};

TCD.isFunction = function(obj) {
  return typeof obj === 'function';
};

//  Credit: jQuery
//  A crude way of determining if an object is a window
TCD.isWindow = function(obj) {
		return obj && typeof obj === "object" && "setInterval" in obj;
};

//  Credit: jQuery
TCD.isPlainObject = function(obj) {
	// Must be an Object.
	// Because of IE, we also have to check the presence of the constructor property.
	// Make sure that DOM nodes and window objects don't pass through, as well
	if (!obj || typeof obj !== "object" || obj.nodeType || TCD.isWindow(obj)) {
		return false;
	}

	// Not own constructor property must be Object
	if ( obj.constructor &&
		!hasOwn.call(obj, "constructor") &&
		!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.

	var key;
	for ( key in obj ) {}

	return key === undefined || hasOwn.call( obj, key );
}

TCD.isSynthesizedProperty = function(property, classDefinition) {
  var arr = classDefinition.synthesizedProperties,
      isSynthesizedProperty = false;
  
  if (arr) {
    var i, len;
    for (i = 0, len = arr.length; i < len; i += 1) {
    	if (arr[i] == property) {
        isSynthesizedProperty = true;
        break;
      }
    }
  }
  
  return isSynthesizedProperty;
};

TCD.objectHasMethod = function (obj, method) {
    return obj !== null && obj[method] !== undefined && TCD.isFunction(obj[method]);
};

TCD.slice = function(array, startIndex, endIndex) {
  var args = [], i;
  for (i = startIndex; i <= endIndex; i += 1) {
  	args.push(array[i]);
  }
  return args;
};

//  Credit: jQuery
//  Augmented to merge accessor methods
TCD.extend = function() {
  var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false,
		getter,
		setter;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !TCD.isFunction(target) ) {
		target = {};
	}

	// extend TCD itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}
				
				// Merge accessor methods
				// getter = options.__lookupGetter__(name);
				// setter = options.__lookupSetter__(name);
				
				// if (getter || setter) {
				//   if (getter) {
				//     target.__defineGetter__(name, getter);
				//   }
				//   
				//   if (setter) {
				//     target.__defineSetter__(name, setter);
				//   }
				// } else {
				  // Recurse if we're merging plain objects or arrays
  				if ( deep && copy && ( TCD.isPlainObject(copy) || (copyIsArray = TCD.isArray(copy)) ) ) {
  					if ( copyIsArray ) {
  						copyIsArray = false;
  						clone = src && TCD.isArray(src) ? src : [];
  
  					} else {
  						clone = src && TCD.isPlainObject(src) ? src : {};
  					}
  
  					// Never move original objects, clone them
  					target[ name ] = TCD.extend( deep, clone, copy );
  
  				// Don't bring in undefined values
  				} else if ( copy !== undefined ) {
  					target[ name ] = copy;
  				}
				// }
			}
		}
	}

	// Return the modified object
	return target;
};

TCD.addListener = function(target, event, handler, context) {
  context = context || target;
  
  if (TCD.browser.IE) {
    target.attachEvent('on' + event, context[handler].context(context));
  } else {
    target.addEventListener(event, context[handler].context(context), false);
  }
};

//--------------------------------------
// TCD.extendDOM(selector)
//--------------------------------------

TCD.extendDOM = function(selector) {
  var $parent = $(selector);
    
  TCD.extendChildren($parent);
};

//--------------------------------------
// TCD.extendChild($element)
//--------------------------------------
// Recursively loop through children of given element
// to extend children before the parent

TCD.extendChildren = function($parent) {
  
  var self = $parent.filter('[sf-class]');
  var children = $parent.children();

  var i, len;
  for (i = 0, len = children.length; i < len; i += 1) {
  	TCD.extendChildren($(children[i]));
  }
  
  if (self.length) {
    
    var el = self[0];
    var basePath = el.getAttribute('sf-class');

  	// loop through namespace to retrieve class function
  	var nsObjects = basePath.split('.');
  	var j, obj, len2;
  	obj = window;
  	
  	for (j = 0, len2 = nsObjects.length; j < len2; j += 1) {
  		obj = obj[nsObjects[j]];
  	}
  	
  	if (!obj) {
      throw new TCD.Error('base class not found');
    }
  	
  	var inst = new obj();
  	
  	TCD.extend(el, inst);
  	el.init();
  }
};
// Augments Array if indexOf is unavailable (IE7, IE8)
if(!Array.indexOf){
  Array.prototype.indexOf = function(obj) {
      for (var i = 0, len = this.length; i < len; i += 1){
          if (this[i] == obj) {
              return i;
          }
      }
      return -1;
  }
}

// make sure Object.create is available in the browser for prototypal inheritance
if (typeof Object.create !== 'function') {
  Object.create = function(o) {
    function F() {}
    F.prototype = o;
    return new F();
  };
}
// Allows for binding context to functions
// when using in event listeners and timeouts
Function.prototype.context = function(obj) {
  var method = this;
  temp = function() {
    return method.apply(obj, arguments);
  };
  return temp;
};

// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  arguments.callee = arguments.callee.caller;  
  if(this.console) console.log( Array.prototype.slice.call(arguments) );
};
// make it safe to use console.log always
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();)b[a]=b[a]||c})(window.console=window.console||{});
//--------------------------------------
// Class
//--------------------------------------
// Heavily inspired by Ben Nadel's "Implementing JavaScript Inheritance and Synthesized Properties"
// http://www.bennadel.com/blog/2040-Implementing-Javascript-Inheritance-And-Synthesized-Accessors-With-Annotation.htm

TCD.Class = function(classDefinition) {
  var classMethods = {},
      i = 0,
      len,
      baseClass,
      getterName,
      setterName,
      propertyName,
      name,
      proto;
      
  // add meta to relate each prototype method to the classDefinition and the method's name
  // this is used for the super retrieval in the callSuper method defined in TCD.Object
  proto = classDefinition.prototype;
  for (name in proto) {
    if (TCD.isFunction(proto[name])) {
      proto[name]._class = classDefinition;
      proto[name]._name = name;
    }
  }
  
  // check to see if class definition has a superclass
  if ('superclass' in classDefinition) {    
    baseClass = classDefinition.superclass;
    
    if (!baseClass.isInitialized) {
      TCD.Class(baseClass);
    }
    
    classMethods = TCD.extend(classMethods, baseClass.prototype);
  }
  
  // add the class's base methods to its prototype
  classMethods = TCD.extend(classMethods, classDefinition.prototype);
  
  var prepareAccessorName = function(accessor, propertyName) {
    return accessor + propertyName.charAt(0).toUpperCase() + propertyName.slice(1);
  }
  
  // add synthesized property methods
  classDefinition.synthesizedProperties = classDefinition.synthesizedProperties || [];
  
  // helper function to bind the accessor method to the correct property name
  var getterHelper = function(propertyName) {
    return function() {
      return this['_' + propertyName];
    };
  }
  
  var setterHelper = function(propertyName) {
    return function(value) {
      this['_' + propertyName] = value;
      return this;
    };
  }
  
  var accessorMethodHelper = function(getterName, setterName) {
    return function() {
      if (arguments.length > 0) {
        // setter
        return this[setterName].apply(this, arguments);
      } else {
        // getter
        return this[getterName]();
      }
    };
  };
  
  for (i = 0, len = classDefinition.synthesizedProperties.length; i < len; i+=1) {
    propertyName = classDefinition.synthesizedProperties[i];
    
    // check for properties that have already been synthesized
    // in the class's parent class
    if (propertyName in classMethods) {
      throw('property: ' + propertyName + ' has already been synthesized in ' + classDefinition);
      continue;
    }
    
    getterName = prepareAccessorName('get', propertyName);
    setterName = prepareAccessorName('set', propertyName);
    
    if (!(getterName in classMethods)) {
      classMethods[getterName] = getterHelper(propertyName);
    }
    
    if (!(setterName in classMethods)) {
      classMethods[setterName] = setterHelper(propertyName);
    }
    
    classMethods[propertyName] = accessorMethodHelper(getterName, setterName);
  }
  
  classDefinition.prototype = classMethods;
  
  classDefinition.isInitialized = true;
};
//--------------------------------------
// Object
//--------------------------------------

TCD.Object = function() {
  this.qualifiedClassName('TCD.Object');
};

TCD.Object.synthesizedProperties = ['qualifiedClassName'];

TCD.Object.prototype = {
  init: function() {
  
  },
  
  callSuper: function() {
    var caller = TCD.Object.prototype.callSuper.caller;
    
    if (TCD.objectHasMethod(caller, 'superclass')) {
      // constructor super
      caller.superclass.apply(this, arguments);
    } else {
      // method super
      var proto = caller._class.superclass.prototype;
      var name = caller._name;
      
      if (TCD.objectHasMethod(proto, name)) {
        return proto[name].apply(this, arguments);
      }
    }
  }
}

TCD.Class(TCD.Object);
//--------------------------------------
// Error
//--------------------------------------

TCD.Error = function(message) {
  this.callSuper();
  this.message(message);
  this.name('Error');
  this.qualifiedClassName('TCD.Error');
};

TCD.Error.superclass = TCD.Object;
TCD.Error.synthesizedProperties = ['message', 'name'];

TCD.Error.prototype = {
  toString: function() {
    return this.name() + ': [' + this.qualifiedClassName() + '] "' + this.message() + '"';
  }
}

TCD.Class(TCD.Error);
TCD.events = TCD.events || {};

//--------------------------------------
// Event
//--------------------------------------

TCD.events.Event = function(type, data, bubbles, cancelable) {
  this.bubbles(bubbles || false);
  this.cancelable(cancelable || false);
  this.data(data || {});
  this.type(type);
};

TCD.events.Event.COMPLETE = 'complete';

TCD.events.Event.synthesizedProperties = ['bubbles', 'cancelable', 'data', 'target', 'type'];
TCD.events.Event.superclass = TCD.Object;
TCD.Class(TCD.events.Event);
TCD.events = TCD.events || {};

//--------------------------------------
// EventDispatcher
//--------------------------------------

TCD.events.EventDispatcher = function() {
  this.callSuper();
  this.qualifiedClassName('TCD.events.EventDispatcher');
  this._eventListeners = {};
};

TCD.events.EventDispatcher.superclass = TCD.Object;

TCD.events.EventDispatcher.prototype = {
  addEventListener: function(type, handler) {
    if (!this._eventListeners[type]) {
      this._eventListeners[type] = [];
    }
    this._eventListeners[type].push(handler);
  },
  
  removeEventListener: function(type, handler) {
    for (var i = 0, len = this._eventListeners[type].length; i < len; i++) {
      if (this._eventListeners[type][i] == handler) {
        this._eventListeners[type].splice(i, 1);
      }
    }
  },
  
  dispatchEvent: function(event) {
    event.target(this);
    var args = [event];
    
    if (this._eventListeners[event.type()]) {
      for (var j = 0, len = this._eventListeners[event.type()].length; j < len; j++) {
        this._eventListeners[event.type()][j].apply(this, args);
      }
    }
  }
};

TCD.Class(TCD.events.EventDispatcher);
TCD.display = TCD.display || {};

//--------------------------------------
// TCD.display.DisplayObject
//--------------------------------------

TCD.display.DisplayObject = function() {
  this.callSuper();
  this.qualifiedClassName('TCD.display.DisplayObject');
  this._scaleX = 1;
  this._scaleY = 1;
  this._scale = 1;
  this._placeholderProperties = [];
};

TCD.display.DisplayObject.superclass = TCD.Object;
TCD.display.DisplayObject.synthesizedProperties = [
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

TCD.display.DisplayObject.prototype = {

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
    return new TCD.geom.Rectangle(this.l(), this.t(), this.w(), this.h());
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
      if (TCD.isSynthesizedProperty(prop, TCD.display.DisplayObject)) {
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

TCD.Class(TCD.display.DisplayObject);
TCD.tasks = TCD.tasks || {};

//--------------------------------------
// TCD.tasks.Task
//--------------------------------------

TCD.tasks.Task = function() {
  this.callSuper();
  this.qualifiedClassName('TCD.tasks.Task');
  this.progress(0);
};

TCD.tasks.Task.superclass = TCD.events.EventDispatcher;
TCD.tasks.Task.synthesizedProperties = [
  'progress',
  'progressive',
  'name',
  'debug'
];

TCD.tasks.Task.prototype = {
  //--------------------------------------
  // Methods
  //--------------------------------------
  
  start: function() {
    this.progress(0);
  },
  
  complete: function() {
    this.progress(1);
    this.dispatchEvent(new TCD.events.Event(TCD.events.Event.COMPLETE));
  },
  
  toString: function() {
    return '[' + this.qualifiedClassName() + ' name=' + this.name() + ']';
  }
};

TCD.Class(TCD.tasks.Task);
TCD.tasks = TCD.tasks || {};

//--------------------------------------
// TCD.tasks.TaskManager
//--------------------------------------

TCD.tasks.TaskManager = function() {
  this._progressiveTasks = [];
  this._createdTasks = [];
  this._tasks = [];
  
  this.callSuper();
  this.qualifiedClassName('TCD.tasks.TaskManager');
};

TCD.tasks.TaskManager.superclass = TCD.tasks.Task;
TCD.tasks.TaskManager.synthesizedProperties = ['tasks'];

TCD.tasks.TaskManager.prototype = {
  //--------------------------------------
  // Getters / Setters
  //--------------------------------------
  
  setTasks: function(value) {    
    var i, len;
    for (i = 0, len = this._tasks.length; i < len; i += 1) {
      	this.removeTask(this.tasks()[i]);
    }
    
    this._tasks = [];
    
    for (i = 0, len = value.length; i < len; i += 1) {
    	this.addTask(value[i]);
    }
  },
  
  getProgress: function() {
    var loadedProgress = 0,
        i, len;
    for (i = 0, len = this._progressiveTasks.length; i < len; i += 1) {
    	var task = this._progressiveTasks[i];
    	loadedProgress += task.progress;
    }
    
		return loadedProgress / Math.max(this._progressiveTasks.length, 1);
  },
  
  setProgress: function(value) {
		var i, len;
		for (i = 0, len = this._progressiveTasks.length; i < len; i += 1) {
			this._progressiveTasks[i].progress(value);
		}
  },
  
  setDebug: function(value) {
    this.callSuper(value);
    var i, len;
    for (i = 0, len = this.tasks().length; i < len; i += 1) {
      this.tasks()[i].debug(value);
    }
  },
  
  //--------------------------------------
  // Methods
  //--------------------------------------
  
  addTask: function(task) {
    if (task) {
      this._tasks.push(task);
      if (task.progressive()) {
        this._progressiveTasks.push(task);
      }
      
      if (this.debug()) {
        task.debug(this.debug());
      }
      this.setProgressive();
    }
    
    return task;
  },
  
  addTaskAt: function(task, index) {
    if (task) {
			if (task.progressive()) {
				this._progressiveTasks.push(task);
				this.progressive(true);
			}
			this.tasks().splice(index, 0, task);
			if (this.debug()) {
				task.debug(this.debug());
			}
			this.setProgressive();
		}
		return task;
  },
  
  contains: function(task) {
    return this.tasks().indexOf(task) != -1;
  },
  
  getTaskAt: function(index) {
    return this.tasks()[index];
  },
  
  getTaskByName: function(name) {
    var taskFound, i, len;
    for (i = 0, len = this.tasks().length; i < len; i += 1) {
    	var task = this.tasks()[i];
    	if (task.name() == name) {
				taskFound = task;
				break;
			}
    }
    
		return taskFound;  
  },
  
  getTaskIndex: function(task) {
    if (!this.contains(task)) {
			throw new TCD.Error("The supplied task must be a child of the caller.");
		}

		return this.tasks().indexOf(task);
  },
  
  removeTask: function(task) {
    if (!this.contains(task)) {
			throw new TCD.Error("The supplied task must be a child of the caller.");
		}
		var index = this.getTaskIndex(task);
		if (index != -1) {
			this.removeTaskAt(index);
		}
		this.setProgressive();
		return task;
  },
  
  removeTaskAt: function(index) {
    var task = this.getTaskAt(index);
		this.tasks().splice(index, 1);
		var progressiveIndex = this._progressiveTasks.indexOf(task);
		if (progressiveIndex != -1) {
			this._progressiveTasks.splice(progressiveIndex, 1);
		}
		this.setProgressive();
		return task;
  },
  
  setTaskIndex: function(task, index) {
    if (!this.contains(task)) {
			throw new TCD.Error("The supplied task must be a child of the caller.");
		}
		var taskIndex = this.getTaskIndex(task);
		this.tasks().splice(index, 0, this.tasks()[taskIndex]);
		this.tasks().splice(taskIndex, 1);
  },
  
  swapTasksAt: function(index1, index2) {
    var temp = this.tasks()[index1];
		this.tasks()[index1] = this.tasks()[index2];
		this.tasks()[index2] = temp;
  },
  
  setProgressive: function() {
    this._progressive = (this._progressiveTasks.length > 0);
  },

  toString: function() {
    return '[' + this.qualifiedClassName() + ']';
  }
};

TCD.Class(TCD.tasks.TaskManager);
TCD.events = TCD.events || {};

//--------------------------------------
// TCD.events.ModelEvent
//--------------------------------------

TCD.events.ModelEvent = function(type, data, bubbles, cancelable) {
  this.callSuper(type, data, bubbles, cancelable);
};

TCD.events.ModelEvent.DATA_UPDATE = 'dataUpdate';

TCD.events.ModelEvent.superclass = TCD.events.Event;
TCD.Class(TCD.events.ModelEvent);
TCD.events = TCD.events || {};

//--------------------------------------
// TCD.events.StateEvent
//--------------------------------------

TCD.events.StateEvent = function(type, data, bubbles, cancelable) {
  this.callSuper(type, data, bubbles, cancelable);
};

TCD.events.StateEvent.CHILD_STATE_CHANGE = 'childStateChange';
TCD.events.StateEvent.STATE_CHANGE = 'stateChange';
TCD.events.StateEvent.STATE_ACTIVATED = 'stateActivated';

TCD.events.StateEvent.superclass = TCD.events.Event;
TCD.Class(TCD.events.StateEvent);
TCD.events = TCD.events || {};

//--------------------------------------
// StateManagerEvent
//--------------------------------------

TCD.events.StateManagerEvent = function(type, data, bubbles, cancelable, state) {
  this.callSuper(type, data, bubbles, cancelable);
  this.state(state);
  this.qualifiedClassName('TCD.events.StateManagerEvent');
};

TCD.events.StateManagerEvent.LOAD_IN_START = 'loadInStart';
TCD.events.StateManagerEvent.LOAD_IN_COMPLETE = 'loadInComplete';
TCD.events.StateManagerEvent.TRANSITION_IN_START = 'transitionInStart';
TCD.events.StateManagerEvent.TRANSITION_IN_COMPLETE = 'transitionInComplete';
TCD.events.StateManagerEvent.LOAD_OUT_START = 'loadOutStart';
TCD.events.StateManagerEvent.LOAD_OUT_COMPLETE = 'loadOutComplete';
TCD.events.StateManagerEvent.TRANSITION_OUT_START = 'transitionOutStart';
TCD.events.StateManagerEvent.TRANSITION_OUT_COMPLETE = 'transitionOutComplete';
TCD.events.StateManagerEvent.TRANSITION_IN_STATE_COMPLETE = 'transitionInStateComplete';
TCD.events.StateManagerEvent.TRANSITION_OUT_STATE_COMPLETE = 'transitionOutStateComplete';
TCD.events.StateManagerEvent.LOAD_IN_STATE_COMPLETE = 'loadInStateComplete';
TCD.events.StateManagerEvent.LOAD_OUT_STATE_COMPLETE = 'loadOutStateComplete';
TCD.events.StateManagerEvent.DEEPLINK = 'deeplink';

TCD.events.StateManagerEvent.superclass = TCD.events.Event;
TCD.events.StateManagerEvent.synthesizedProperties = ['state'];
TCD.Class(TCD.events.StateManagerEvent);
TCD.events = TCD.events || {};

//--------------------------------------
// TimerEvent
//--------------------------------------

TCD.events.TimerEvent = function(type, data, bubbles, cancelable) {  
  this.callSuper(type, data, bubbles, cancelable);
  this.qualifiedClassName('TCD.events.TimerEvent');
};

TCD.events.TimerEvent.TIMER = 'timer';
TCD.events.TimerEvent.TIMER_COMPLETE = 'timerComplete';

TCD.events.TimerEvent.superclass = TCD.events.Event;
TCD.Class(TCD.events.TimerEvent);
TCD.geom = TCD.geom || {};

//--------------------------------------
// TCD.geom.Point
//--------------------------------------

TCD.geom.Point = function(x, y) {
  this.callSuper();
  this.qualifiedClassName('TCD.geom.Point');
  this.x = x;
  this.y = y;
};

TCD.geom.Point.superclass = TCD.Object;

TCD.geom.Point.prototype = {  
  //--------------------------------------
  // Methods
  //--------------------------------------

  toString: function() {
    return '[' + this.qualifiedClassName() + ']';
  }
};

TCD.Class(TCD.geom.Point);
TCD.geom = TCD.geom || {};

//--------------------------------------
// TCD.geom.Rectangle
//--------------------------------------

TCD.geom.Rectangle = function(x, y, width, height) {
  this.callSuper();
  this.qualifiedClassName('TCD.geom.Rectangle');
  
  this.x(x);
  this.y(y);
  this.width(width);
  this.height(height);
};

TCD.geom.Rectangle.superclass = TCD.Object;
TCD.geom.Rectangle.synthesizedProperties = [
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

TCD.geom.Rectangle.prototype = {
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
    return new TCD.geom.Point(this.width(), this.height());
  },
  
  getTopLeft: function() {
    return new TCD.geom.Point(this.top(), this.left());
  },
  
  getBottomRight: function() {
    return new TCD.geom.Point(this.bottom(), this.right());
  },
  
  //--------------------------------------
  // Methods
  //--------------------------------------
  
  clone: function() {
    return new TCD.geom.Rectangle(this.x(), this.y(), this.width(), this.height());
  },
  
  toString: function() {
    return '[' + this.qualifiedClassName() + ']';
  }
};

TCD.Class(TCD.geom.Rectangle);
TCD.math = TCD.math || {};

//--------------------------------------
// Percent
//--------------------------------------
// Port of org.casalib.math.Percent from CASA lib for ActionScript 3.0
// http://casalib.org/

TCD.math.Percent = function(percentage, isDecimalPercentage) {
  this.callSuper();
  
  percentage = isDecimalPercentage || 0;
  isDecimalPercentage = isDecimalPercentage || true;
  
  if (isDecimalPercentage) {
    this.decimalPercentage(percentage);
  } else {
    this.percentage(percentage);
  }
};

TCD.math.Percent.superclass = TCD.Object;
TCD.synthesizedProperties = ['percentage', 'decimalPercentage'];

TCD.prototype = {
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
    return new TCD.math.Percent(this.decimalPercentage());
  },
  
  valueOf: function() {
    return this.decimalPercentage();
  },
  
  toString: function() {
    return this.decimalPercentage().toString();
  }
};

TCD.Class(TCD.math.Percent);
TCD.model = TCD.model || {};

//--------------------------------------
// TCD.model.Model
//--------------------------------------

TCD.model.Model = function() {
  this.callSuper();
  this.qualifiedClassName('TCD.model.Model');
};

TCD.model.Model.superclass = TCD.events.EventDispatcher;
TCD.model.Model.synthesizedProperties = ['data'];

TCD.model.Model.prototype = {

  //--------------------------------------
  // Getters / Setters
  //--------------------------------------
  
  setData: function(value) {
    this._data = value;
    this.dispatchEvent(new TCD.events.ModelEvent(TCD.events.ModelEvent.DATA_UPDATE));
  },

  //--------------------------------------
  // Methods
  //--------------------------------------

  toString: function() {
    return '[' + this.qualifiedClassName() + ']';
  }
};

TCD.Class(TCD.model.Model);
TCD.state = TCD.state || {};

//--------------------------------------
// Redirect
//--------------------------------------

TCD.state.Redirect = function(location, newLocation) {
  this.callSuper();
  this.qualifiedClassName('TCD.state.Redirect');
  this.location(location);
  this.newLocation(newLocation);
}

TCD.state.Redirect.superclass = TCD.Object;
TCD.state.Redirect.synthesizedProperties = ['location', 'newLocation'];

TCD.Class(TCD.state.Redirect);
TCD.state = TCD.state || {};

//--------------------------------------
// TCD.state.State
//--------------------------------------

TCD.state.State = function(name) {
  this.callSuper();
  this.name(name);
  this._children = [];
  this.qualifiedClassName('TCD.state.State');
};

TCD.state.State.superclass = TCD.events.EventDispatcher;
TCD.state.State.synthesizedProperties = [
  'root',
  'children',
  'stateManager',
  'parent',
  'name',
  'title',
  'description',
  'defaultChild',
  'selectedChild',
  'activatedChild',
  'selectedChildIndex',
  'selected',
  'index',
  'stateLocation',
  'selectable',
  'pageViewName',
  'numChildren',
  'transitionIn',
  'transitionOut',
  'loadIn',
  'loadOut',
  'activated',
  'childClass'
];

TCD.state.State.prototype = {
  //--------------------------------------
  // Getters / Setters
  //--------------------------------------
  
  setRoot: function(value) {
    this._root = value;
    for (var i = 0, len = this.children().length; i < len; i+=1) {
      this.children()[i].root(this.root());
    }
  },
  
  setStateManager: function(value) {
    this._stateManager = value;
    for (var i = 0, len = this.children().length; i < len; i+=1) {
      this.children()[i].stateManager(this.stateManager());
    }
  },
  
  setChildren: function(value) {
    for (var i = 0, len = this.children().length; i < len; i+=1) {
      this.removeChild(this.children()[i]);
    }
    
    this.children() = [];
    
    for (i = 0, len = value.length; i < len; i++) {
      this.addChild(value[i]);
    }
  },
  
  setSelectedChild: function(value) {
    if (!this.contains(value)) {
      throw new TCD.Error('The supplied child must be a child of the caller.');
    }
    
    this._selectedChild = value;
  },
  
  getActivatedChild: function() {
    var state, i, len;
    for (i = 0, len = this.children().length; i < len; i+=1) {
      child = this.children()[i];
      if (child.activated) {
        state = child;
        break;
      }
    }
    return state;
  },
  
  getNumChildren: function() {
    return this.children().length;
  },
  
  getSelectedChildIndex: function() {
    var index;
    if (this.selectedChild()) {
      index = this.getChildIndex(this.selectedChild());
    }
    
    return index;
  },
  
  setSelectedChildIndex: function(value) {
    var child = this.getChildAt(value);
    this.selectedChild(child);
  },
  
  setSelected: function(value) {
    if (value != this.selected()) {
      this._selected = value;
      this.dispatchEvent(new TCD.events.StateEvent(TCD.events.StateEvent.STATE_CHANGE));
    }
  },
  
  getIndex: function() {
    return this.parent().getChildIndex(this);
  },
  
  getStateLocation: function() {
    var locationArray = [],
        state = this,
        location = '',
        i, len, inlineState;
    
    while (state) {
      locationArray.push(state);
      state = state.parent();
    }
    
    locationArray.reverse();
    
    for (i = 0, len = locationArray.length; i < len; i+=1) {
      inlineState = locationArray[i];
      location += inlineState.name();
      if (inlineState != locationArray[len - 1]) {
        location += '/';
      }
    }
    
    return location;
  },
  
  //--------------------------------------
  // Event Handlers
  //--------------------------------------
  
  childChangeHandler: function(event) {
    var child = event.target();
    if (child.selected()) {
      this._selectedChild = child;
    } else
    if (child == this._selectedChild) {
      this._selectedChild = undefined;
    }
    
    this.dispatchEvent(new TCD.events.StateEvent(TCD.events.StateEvent.CHILD_STATE_CHANGE));
  },
  
  //--------------------------------------
  // Methods
  //--------------------------------------
  
  addChild: function(child) {
    child.parent(this);
    child.stateManager(this.stateManager());
    child.root(this.root());
    this.children().push(child);
    child.addEventListener(TCD.events.StateEvent.STATE_CHANGE, this.childChangeHandler.context(this));
  },
  
  addChildAt: function(child, index) {
    child.parent(this);
    child.stateManager(this.stateManager());
    child.root(this.root());
    this.children().splice(index, 0, child);
    child.addEventListener(TCD.events.StateEvent.STATE_CHANGE, this.childChangeHandler.context(this));
    return child;
  },
  
  contains: function(child) {
    return this.children().indexOf(child) != -1;
  },
  
  getChildAt: function(index) {
    return this.children()[index];
  },
  
  getChildByName: function(name) {
    var foundChild, i, len, child;
    for (i = 0, len = this.children().length; i < len; i+=1) {
      child = this.children()[i];
      if (child.name() == name) {
        foundChild = child;
        break;
      }
    }
    
    return foundChild;
  },
  
  getChildIndex: function(child) {
    if (!this.contains(child)) {
      throw new TCD.Error('The supplied child must be a child of the caller.');
    }
    
    return this.children().indexOf(child);
  },
  
  removeChild: function(child) {
    if (!this.contains(child)) {
      throw new TCD.Error('The supplied child must be a child of the caller.');
    }
    
    var index = this.getChildIndex(child),
        child;
        
    if (index != -1) {
      child = this.removeChildAt(index);
    }
    
    return child;
  },
  
  removeChildAt: function(index) {
    var child = this.getChildAt(index);
    child.removeEventListener(TCD.events.StateEvent.STATE_CHANGE, this.childChangeHandler.context(this));
    this.children().splice(index, 1);
    return child;
  },
  
  setChildIndex: function(child, index) {
    if (!this.contains(child)) {
      throw new TCD.Error('The supplied child must be a child of the caller.');
    }
    
    var childIndex = this.getChildIndex(child);
    this.children().splice(index, 0, this.children()[childIndex]);
    this.children().splice(childIndex, 1);
  },
  
  swapChildrenAt: function(index1, index2) {
    var temp = this.children()[index1];
    this.children()[index1] = this.children()[index2];
    this.children()[index2] = temp;
  },
  
  setSelectedChildByName: function(name) {
    var foundChild, i, len, child;
    for (i = 0, len = this.children().length; i < len; i+=1) {
      child = this.children()[i];
      if (child.name() == name) {
        foundChild = child;
        break;
      }
    }
    
    if (foundChild) {
      this.selectedChild(foundChild);
    } else {
      throw new TCD.Error('The supplied child must be a child of the caller.');
    }
  },
  
  browse: function() {
    this.stateManager().location(this.stateLocation());
  },
  
  browsePreviousSibling: function() {
    var previousIndex = this.index - 1;
    if (previousIndex < 0) {
      previousIndex = this.parent().children().length - 1;
    }
    
    this.parent().getChildAt(previousIndex).browse();
  },
  
  browseNextSibling: function() {
    var nextIndex = index + 1;
    
    if (nextIndex > this.parent().children().length - 1) {
      nextIndex = 0;
    }
    
    this.parent().getChildAt(nextIndex).browse();
  },
  
  browsePreviousChild: function() {
    var previousIndex = this.selectedChildIndex() - 1;
    
    if (previousIndex < 0) {
      previousIndex = this.children().length - 1;
    }
    
    this.getChildAt(previousIndex).browse();
  },
  
  browseNextChild: function() {
    var nextIndex = this.selectedChildIndex() + 1;
    
    if (nextIndex > this.children().length - 1) {
      nextIndex = 0;
    }
    
    this.getChildAt(nextIndex).browse();
  },
  
  getChildFromPath: function(path) {
    var state = this,
        i, len;
    if (path.length > 0) {
      var names = path.split('/');
      for (i = 0, len = names.length; i < len; i+=1) {
        state = state.getChildByName(names[i]);
      }
    }
    
    return state;
  },
  
  createChildByName: function(value) {
    
    if (!this.childClass()) {
      throw new TCD.Error(this + ': no child class defined');
    }
    
    var state = new this.childClass();
		state.name(value);
		this.addChild(state);
		return state;
  },
  
  toString: function() {
    return '[State' + ' name=' + this.name() + ' title=' + this.title() + ' className=' + this.qualifiedClassName() + ' defaultChild=' + this.defaultChild()  + ']';
  }
};

TCD.Class(TCD.state.State);
TCD.state = TCD.state || {};

//--------------------------------------
// TCD.state.StateManager
//--------------------------------------

TCD.state.StateManager = function(name, root) {
  this.callSuper();
  this.root(root);
  this.qualifiedClassName('TCD.state.StateManager');
  this.name(name || this.qualifiedClassName() + Math.round(Math.random() * 100000));
  this.pageViewType(TCD.state.StateManager.PAGE_VIEW_LOCATION);
  this._progressTimer = new TCD.utils.Timer(33);
  this._progressTimer.addEventListener(TCD.events.TimerEvent.TIMER, this.taskManagerProgressHandler.context(this));
  this._transitionInPath;
  this._transitionWasInterrupted;
  this._isInTransition;
  this._transitions;
  this._currentTransition;
  this._redirects = [];
};

TCD.state.StateManager.PAGE_VIEW_LOCATION = 'pageViewLocation';
TCD.state.StateManager.PAGE_VIEW_NAME = 'pageViewName';

TCD.state.StateManager.superclass = TCD.events.EventDispatcher;
TCD.state.StateManager.synthesizedProperties = [
  'root',
  'deepLinking',
  'tree',
  'startLocation',
  'location',
  'activeStates',
  'taskManager',
  'preloader',
  'selectedStates',
  'debug',
  'trackViewPages',
  'pageViewType',
  'redirects',
  'name'
];

TCD.state.StateManager.prototype = {
  //--------------------------------------
  // Getters / Setters
  //--------------------------------------
  
  setDeepLinking: function(value) {
    this._deepLinking = value;
    if (this.deepLinking()) {
      this.deepLinking().change(this.deepLinkingChangeHandler.context(this));
    }
  },
  
  setTree: function(value) {
    this._tree = value;
    value.stateManager(this);
    value.root(this.root());
  },
  
  getLocation: function() {
    var states = this.selectedStates(),
        loc = '',
        i, len;
        
    for (i = 0, len = states.length; i < len; i+=1) {
      var inlineState = states[i];
      loc += inlineState.name();
      if (inlineState != states[states.length - 1]) {
        loc += '/';
      }
    }
    
    return loc;
  },
  
  setLocation: function(value) {
    if (this.deepLinking()) {
      var array = value.split('/');
      array.shift();
      var loc = '/' + array.join('/');
      this.deepLinking().value(loc);
    } else {
      var locationArray = value.split('/');
      locationArray.shift();
      var state = this.tree();
      if (locationArray.length > 0) {
        state = state.getChildFromPath(locationArray.join('/'));
      }
      
      this._transitionInPath = state.stateLocation();
      this.checkIfInTransition();
    }
  },
  
  getSelectedStates: function() {
    var states = [],
        state;
        
    if (this.tree().selected()) {
      state = this.tree();
    }
    
    while (state) {
      states.push(state);
      state = state.selectedChild();
    }
    
    return states;
  },
  
  //--------------------------------------
  // Event Handlers
  //--------------------------------------
  
  deepLinkingChangeHandler: function(event) {
    var path = this.deepLinking().value();
    if (path == '' || path == '/') {
      this._transitionInPath = this.tree().stateLocation();
    } else {
      this._transitionInPath = this.tree().name() + path;
    }
    
    this.checkIfInTransition();
  },
  
  taskManagerProgressHandler: function(event) {
    var totalProgress = this.taskManager().progress();
    if (this.debug()) {
      log(this.name() + ' totalProgress = ' + totalProgress);
    }
    
    if (isNaN(totalProgress)) {
      totalProgress = 0;
    }
    
    if (this.preloader()) {
      this.preloader().progress(totalProgress);
    }
  },
    
  transitionInCompleteHandler: function(event) {
    if (this.trackPageViews()) {
  		var param;
  		switch(this.pageViewType()) {
  			case TCD.state.StateManager.PAGE_VIEW_LOCATION:
  				param = this.location();
  			break;
  			case TCD.state.StateManager.PAGE_VIEW_NAME:
  				param = this.location();
  			break;
  		}
  	}
  },
  
  taskManagerCompleteHandler: function(event) {
    this.taskManager().removeEventListener(TCD.events.Event.COMPLETE, this.taskManagerCompleteHandler.context(this));
		if (this.taskManager().progressive()) {
			this.taskManagerProgressHandler();
			this._progressTimer.stop();
		}
		
		this.dispatchEvent(new TCD.events.Event(this._currentTransition.transitionName() + "Complete"));
		this._currentTransition = null;
		if (this._transitions.length > 0) {
			this.startTransition();
		} else {
			this._transitions = null;
			this._isInTransition = false;
			if (this._transitionWasInterrupted) {
				this.startTransitions();
			}
		}
  },
  
  //--------------------------------------
  // Methods
  //--------------------------------------
  
  init: function() {
    if (this.deepLinking()) {
      if (this.deepLinking().value() != '/') {
        this.deepLinkingChangeHandler();
      } else
      if (this.startLocation()) {
        this.location(this.startLocation());
      } else {
        this._transitionInPath = this.tree().stateLocation();
        this.checkIfInTransition(); 
      }
    } else 
    if (this.startLocation()) {
      this.location(this.startLocation());
    } else {
      this._transitionInPath = this.tree().stateLocation();
      this.checkIfInTransition();
    }
  },
  
  checkIfInTransition: function() {
    if (this._isInTransition) {
      this._transitionWasInterrupted = true;
    } else {
      this.startTransitions();
    }
  },
  
  startTransitions: function() {
    
    this._transitionWasInterrupted = false;
    this._isInTransition = false;
    
    this._transitionInPath = this.checkRedirect(this._transitionInPath);
    
    var nextLocationArray = this._transitionInPath.split('/');
    
    var locationPathArray = [];
    if (this.location().length > 0) {
      locationPathArray = this.location().split('/');
    }
    
    var breakIndex = 0, i, len, currentArray, currentPath, nextArray, nextPath;

    for (i = 0, len = locationPathArray.length; i < len; i+=1) {
      currentArray = locationPathArray.slice(0, i + 1);
      currentPath = currentArray.join('/');
      nextArray = nextLocationArray.slice(0, i + 1);
      nextPath = nextArray.join('/');
      if (currentPath == nextPath) {
        breakIndex += 1;
      }
    }
    
    this._transitions = [];
    
    var transitionOutPaths = [];
    for (i = locationPathArray.length - 1; i >= breakIndex; i-=1) {
      currentArray = locationPathArray.slice(0, i + 1);
      transitionOutPaths.push(currentArray.join('/'));
    }
    
    this.deactivateStates(transitionOutPaths);
    
    this._transitions.push(new TCD.state.TransitionProperties(transitionOutPaths.slice(), 'loadOut', false));
    this._transitions.push(new TCD.state.TransitionProperties(transitionOutPaths.slice(), 'transitionOut', false));
    
    var transitionInPaths = [];
    for (i = breakIndex, len = nextLocationArray.length; i < len; i+=1) {
      nextArray = nextLocationArray.slice(0, i + 1);
      transitionInPaths.push(nextArray.join('/'));
    }

    transitionInPaths = this.activateStates(transitionInPaths);

    if (transitionInPaths.length == 0) {
      transitionInPaths = this.checkForDefaultStates(this._transitionInPath);
    }
    
    this._transitions.push(new TCD.state.TransitionProperties(transitionInPaths.slice(), 'loadIn', false));
    this._transitions.push(new TCD.state.TransitionProperties(transitionInPaths.slice(), 'transitionIn', false));
    
    this.startTransition();
  },
  
  deactivateStates: function(transitionPaths) {
    var i, len;
    for (i = 0, len = transitionPaths.length; i < len; i+=1) {
      var path = transitionPaths[i];
      var pathArray = path.split('/');
      pathArray.shift();
      var state = this.tree();
      if (pathArray.length > 0) {
        var j, len2;
        for (j = 0, len2 = pathArray.length; j < len2; j+=1) {
          var currentState = state;
          state = currentState.getChildByName(pathArray[j]);
        }
      }
      
      state.activated(false);
    }
  },
  
  activateStates: function(transitionPaths) {
    var newPaths = [], i, len;
		this._activeStates = [];
		for (i = 0, len = transitionPaths.length; i < len; i += 1) {
		  var path = transitionPaths[i];
			var pathArray = path.split("/");
			pathArray.shift();
			var state = this.tree();
			
      if (pathArray.length > 0) {
        var j, len2;
				for (j = 0, len2 = pathArray.length; j < len2; j += 1) {
					var currentState = state;
					state = currentState.getChildByName(pathArray[j]);
					if (!state) {
						state = currentState.createChildByName(pathArray[j]);
					}
				}
			}
			
			state.activated(true);
			this.activeStates().push(state);
			newPaths.push(state.stateLocation());
			
			if (state.stateLocation() == transitionPaths[transitionPaths.length - 1]) {
				var defaultState = state.getChildByName(state.defaultChild());
				while (defaultState) {
					defaultState.activated(true);
					this.activeStates().push(defaultState);
					newPaths.push(defaultState.stateLocation());
					defaultState = defaultState.getChildByName(defaultState.defaultChild());
				}
			}
			
		}
		
		return newPaths;
  },
  
  checkForDefaultStates: function(path) {
    var newPaths = [];
		var pathArray = path.split("/");
		pathArray.shift();
		var state = this.tree();
		if (pathArray.length > 0) {
		  var i, len;
			for (i = 0, len = pathArray.length; i < len; i += 1) {
				var currentState = state;
				state = currentState.getChildByName(pathArray[i]);
			}
		}
		var defaultState = state.getChildByName(state.defaultChild);
		while (defaultState) {
			defaultState.activated(true);
			this.activeStates().push(defaultState);
			newPaths.push(defaultState.stateLocation());
			defaultState = defaultState.getChildByName(defaultState.defaultChild());
		}
		
		return newPaths;
  },
  
  startTransition: function() {
    this._currentTransition = this._transitions.shift();
		this.dispatchEvent(new TCD.events.Event(this._currentTransition.transitionName() + "Start"));
		
		this.taskManager(new TCD.tasks.SequentialTask());
		
		this.taskManager().name(this._currentTransition.transitionName());
		if (this.debug()) {
			this.taskManager().debug(this.debug());
		}
		
		this.taskManager().addEventListener(TCD.events.Event.COMPLETE, this.taskManagerCompleteHandler.context(this));
		
		var i, len;
		
		for (i = 0, len = this._currentTransition.locations().length; i < len; i += 1) {
		  var path = this._currentTransition.locations()[i];
			var pathArray = path.split("/");
			pathArray.shift();
			var state = this.tree();
			if (pathArray.length > 0) {
				state = state.getChildFromPath(pathArray.join("/"));
			}
			var task = state[this._currentTransition.transitionName()]();
			
			if (task) {
				this.taskManager().addTask(task);
			}
			var stateSelected;
			if (this._currentTransition.transitionName() == "transitionIn") {
				stateSelected = true;
			}
			if (this._currentTransition.transitionName() == "transitionOut") {
				stateSelected = false;
			}
			this.taskManager().addTask(new TCD.tasks.PropertyTask(state, "selected", stateSelected));
		}
		if (this.taskManager().progress() == 1) {
			this.taskManager().progressive(false);
		}
		if (this.taskManager().progressive()) {
			if (this.preloader()) {
				this.taskManager().addTaskAt(new TCD.tasks.PropertyTask(this.preloader(), "progress", 0), 0);
				this.taskManager().addTaskAt(this.preloader().transitionIn(), 1);
				this.taskManager().addTask(this.preloader().transitionOut());
			}
			this.taskManager().progress(0);
			this._progressTimer.start();
		}
		this.taskManager().start();
  },
  
  addRedirect: function(location, newLocation) {
    this.removeRedirect(location);
		this.redirects.push(new TCD.state.Redirect(location, newLocation));
  },
  
  removeRedirect: function(location) {
    var newRedirects = [];
    var i, len;
		for (i = 0, len = this.redirects().length; i < len; i += 1) {
		  var redirect = this.redirects()[i];
			if (redirect.location() != location) {
				newRedirects.push(redirect);
			}
		}
		this.redirects(newRedirects);
  },
  
  checkRedirect: function(path) {
    var i, len;
		for (i = 0, len = this.redirects().length; i < len; i += 1) {
		  var redirect = redirects()[i];
			if (path == redirect.location()) {
				path = redirect.newLocation();
			}
		}
		
		return path;
  },
  
  toString: function() {
    return '[StateManager' + ' name=' + this.name() + ' className = ' + this.qualifiedClassName() + ']';
  }
};

TCD.Class(TCD.state.StateManager);
TCD.state = TCD.state || {};

//--------------------------------------
// TCD.state.TransitionProperties
//--------------------------------------

TCD.state.TransitionProperties = function(locations, transitionName, showPreloader) {
  this.callSuper();
  this.locations(locations);
  this.transitionName(transitionName);
  this.showPreloader(showPreloader);
}

TCD.state.TransitionProperties.superclass = TCD.Object;
TCD.state.TransitionProperties.synthesizedProperties = ['locations', 'transitionName', 'showPreloader', 'currentState'];

TCD.state.TransitionProperties.prototype = {
  toString: function() {
    return this.transitionName();
  }
}

TCD.Class(TCD.state.TransitionProperties);
TCD.tasks = TCD.tasks || {};

//--------------------------------------
// TCD.tasks.FunctionTask
//--------------------------------------

TCD.tasks.FunctionTask = function(context, method) {
  this.callSuper();
  this.qualifiedClassName('TCD.tasks.FunctionTask');
  this.method(method);
  this.context(context);
  this.args([]);
  var i, len;
  for (i = 2, len = arguments.length; i < len; i += 1) {
  	this.args().push(arguments[i]);
  }
};

TCD.tasks.FunctionTask.superclass = TCD.tasks.Task;
TCD.tasks.FunctionTask.synthesizedProperties = ['context', 'method', 'args'];

TCD.tasks.FunctionTask.prototype = {
  //--------------------------------------
  // Methods
  //--------------------------------------
  
  start: function() {
    this.method().apply(this.context(), this.args());
    this.complete();
  },

  toString: function() {
    return '[' + this.qualifiedClassName() + ']';
  }
};

TCD.Class(TCD.tasks.FunctionTask);
TCD.tasks = TCD.tasks || {};

//--------------------------------------
// TCD.tasks.JQueryAjaxTask
//--------------------------------------

TCD.tasks.JQueryAjaxTask = function(url, settings) {
  this.callSuper();
  this.qualifiedClassName('TCD.tasks.JQueryAjaxTask');
  this.url(url);
  this.settings(settings);
};

TCD.tasks.JQueryAjaxTask.superclass = TCD.tasks.Task;
TCD.tasks.JQueryAjaxTask.synthesizedProperties = ['url', 'settings', 'content'];

TCD.tasks.JQueryAjaxTask.prototype = {  
  //--------------------------------------
  // Event Handlers
  //--------------------------------------
  
  ajaxSuccessHandler: function(data, textStatus, jqXHR) {
    this.content(data);
    this.complete();
  },
  
  ajaxErrorHandler: function(jqXHR, textStatus, errorThrown) {
    if (this.debug()) {
      log(this + ' Error: could not load this file. textStatus=' + textStatus + ' errorThrown=' + errorThrown);
    }
    this.complete();
  },
  
  ajaxComplete: function(jqXHR, textStatus) {
    if (this.debug()) {
      log(this + ' Complete: textStatus=' + textStatus);
    }
  },
  
  //--------------------------------------
  // Methods
  //--------------------------------------
  
  start: function() {
    $.ajax(this.url(), this.settings())
      .success(this.ajaxSuccessHandler.context(this))
      .error(this.ajaxErrorHandler.context(this))
      .complete(this.ajaxComplete.context(this));
  },

  toString: function() {
    return '[' + this.qualifiedClassName() + ']';
  }
};

TCD.Class(TCD.tasks.JQueryAjaxTask);
TCD.tasks = TCD.tasks || {};

//--------------------------------------
// TCD.tasks.JQueryEffectTask
//--------------------------------------

TCD.tasks.JQueryEffectTask = function(target, effect) {
  this.callSuper();
  this.qualifiedClassName('TCD.tasks.JQueryEffectTask');
  
  var args = TCD.slice(arguments, 2, arguments.length - 1);
  
  if (!TCD.isFunction(target[effect])) {
    throw new TCD.Error('target does not support this effect');
  }
  
  this.target(target);
  this.effect(effect);
  this.args(args);
};

TCD.tasks.JQueryEffectTask.superclass = TCD.tasks.Task;
TCD.tasks.JQueryEffectTask.synthesizedProperties = ['target', 'effect', 'args'];

TCD.tasks.JQueryEffectTask.prototype = {

  //--------------------------------------
  // Event Handlers
  //--------------------------------------
  
  effectCompleteHandler: function() {
    this.complete();
  },

  //--------------------------------------
  // Methods
  //--------------------------------------
  
  start: function() {
    this.args().push($.proxy(this.effectCompleteHandler, this));
    this.target()[this.effect()].apply(this.target(), this.args());
  },

  toString: function() {
    return '[' + this.qualifiedClassName() + ']';
  }
};

TCD.Class(TCD.tasks.JQueryEffectTask);
TCD.tasks = TCD.tasks || {};

//--------------------------------------
// TCD.tasks.JQueryGetJSONTask
//--------------------------------------

TCD.tasks.JQueryGetJSONTask = function(url, data) {
  this.callSuper();
  this.qualifiedClassName('TCD.tasks.JQueryGetJSONTask');    
  this.url(url);
  this.data(data);
};

TCD.tasks.JQueryGetJSONTask.superclass = TCD.tasks.Task;
TCD.tasks.JQueryGetJSONTask.synthesizedProperties = ['url', 'data', 'content'];

TCD.tasks.JQueryGetJSONTask.prototype = {
  
  //--------------------------------------
  // Event Handlers
  //--------------------------------------
  
  jsonHandler: function(data, textStatus) {
    switch (textStatus) {
      case 'success':
        this.content(data);
      break;
    }
    
    this.complete();
  },

  //--------------------------------------
  // Methods
  //--------------------------------------
  
  start: function() {
    $.getJSON(this.url(), this.jsonHandler.context(this));
  },

  toString: function() {
    return '[' + this.qualifiedClassName() + ']';
  }
};

TCD.Class(TCD.tasks.JQueryGetJSONTask);
TCD.tasks = TCD.tasks || {};

//--------------------------------------
// TCD.tasks.JQueryImageLoaderTask
//--------------------------------------

TCD.tasks.JQueryImageLoaderTask = function(url) {
  this.callSuper();
  this.qualifiedClassName('TCD.tasks.JQueryImageLoaderTask');
  
  this.url(url);
  this.content(new Image());
  this.$content($(this.content()));
  
  this.$content()
    .load(this.completeHandler.context(this))
    .error(this.errorHandler.context(this));
};

TCD.tasks.JQueryImageLoaderTask.superclass = TCD.tasks.Task;
TCD.tasks.JQueryImageLoaderTask.synthesizedProperties = ['url', 'content', '$content'];

TCD.tasks.JQueryImageLoaderTask.prototype = {

  //--------------------------------------
  // Event Handlers
  //--------------------------------------
  
  completeHandler: function() {
    this.complete();
  },
  
  errorHandler: function() {
    if (this.debug()) {
      log(this + ' Error: could not load this file.');
    }
    this.complete();
  },
  
  //--------------------------------------
  // Methods
  //--------------------------------------
  
  start: function() {
    this.$content().attr('src', this.url());
  },

  toString: function() {
    return '[' + this.qualifiedClassName() + ' url=' + this.url() + ']';
  }
};

TCD.Class(TCD.tasks.JQueryImageLoaderTask);
TCD.tasks = TCD.tasks || {};

//--------------------------------------
// TCD.tasks.JQueryLoadTask
//--------------------------------------

TCD.tasks.JQueryLoadTask = function(url, $target) {
  this.callSuper();
  this.qualifiedClassName('TCD.tasks.JQueryLoadTask');
  
  if (!url) throw new TCD.Error('a valid url must be specified');
  
  this.url(url);
  this.$target($target || $('body'));
};

TCD.tasks.JQueryLoadTask.superclass = TCD.tasks.Task;
TCD.tasks.JQueryLoadTask.synthesizedProperties = ['url', '$target'];

TCD.tasks.JQueryLoadTask.prototype = {
  //--------------------------------------
  // Event Handlers
  //--------------------------------------
  
  loadHandler: function(response, status, xhr) {
    if (status == 'error') {
      log(this + ' Error: could not load this file');
    }
    
    this.complete();
  },

  //--------------------------------------
  // Methods
  //--------------------------------------
  
  start: function() {
    this.$target().load(this.url(), this.loadHandler.context(this));
  },

  toString: function() {
    return '[' + this.qualifiedClassName() + ' url=' + this.url() + ']';
  }
};

TCD.Class(TCD.tasks.JQueryLoadTask);
TCD.tasks = TCD.tasks || {};

//--------------------------------------
// TCD.tasks.ParallelTask
//--------------------------------------

TCD.tasks.ParallelTask = function() {
  this.callSuper();
  this.qualifiedClassName('TCD.tasks.ParallelTask');
  
  if (arguments.length > 0) {
    this.tasks(arguments);
  }
};

TCD.tasks.ParallelTask.superclass = TCD.tasks.TaskManager;

TCD.tasks.ParallelTask.prototype = {
  //--------------------------------------
  // Event Handlers
  //--------------------------------------
  
  taskCompleteHandler: function(event) {
    var task = event.target();
		if (this.debug()) {
			log("taskComplete " + task);
		}
		task.removeEventListener(TCD.events.Event.COMPLETE, this.taskCompleteHandler.context(this));
		this._createdTasks.push(task);
		if (this._createdTasks.length == this.tasks().length) {
		  if (this.debug()) {
		    log('tasksComplete ' + this);
		  }
			this.complete();
		}
  },
  
  //--------------------------------------
  // Methods
  //--------------------------------------
  
  start: function() {
    this._createdTasks = [];
    if (this.tasks().length > 0) {
      var i, len;
      for (i = 0, len = this.tasks().length; i < len; i += 1) {
        	var task = this.tasks()[i];
        	task.addEventListener(TCD.events.Event.COMPLETE, this.taskCompleteHandler.context(this));
        	if (this.debug()) {
        	 log('taskStart ' + task);
        	}
        	task.start();
      }
    } else {
      this.complete();
    }
  },

  toString: function() {
    return '[' + this.qualifiedClassName() + ' name=' + this.name() + ']';
  }
};

TCD.Class(TCD.tasks.ParallelTask);
TCD.tasks = TCD.tasks || {};

//--------------------------------------
// TCD.tasks.PropertyTask
//--------------------------------------

TCD.tasks.PropertyTask = function(target, property, value) {
  this.callSuper();
  this.qualifiedClassName('TCD.tasks.PropertyTask');
  this.target(target);
  this.property(property);
  this.value(value);
};

TCD.tasks.PropertyTask.superclass = TCD.tasks.Task;
TCD.tasks.PropertyTask.synthesizedProperties = ['target', 'property', 'value'];

TCD.tasks.PropertyTask.prototype = {
  //--------------------------------------
  // Methods
  //--------------------------------------
  
  start: function() {
    this.target()[this.property()](this.value());
    this.complete();
  },
  
  toString: function() {
    return '[' + this.qualifiedClassName() + ' target=' + this.target() + ' property=' + this.property() + ' value=' + this.value() + ']';
  }
};

TCD.Class(TCD.tasks.PropertyTask);
TCD.tasks = TCD.tasks || {};

//--------------------------------------
// TCD.tasks.SequentialTask
//--------------------------------------

TCD.tasks.SequentialTask = function() {
  this.callSuper();
  this.qualifiedClassName('TCD.tasks.SequentialTask');
  
  if (arguments.length > 0) {
    this.tasks(arguments);
  }
};

TCD.tasks.SequentialTask.superclass = TCD.tasks.TaskManager;
TCD.tasks.SequentialTask.synthesizedProperties = [];

TCD.tasks.SequentialTask.prototype = {

  //--------------------------------------
  // Event Handlers
  //--------------------------------------
  
  taskCompleteHandler: function(event) {
    var task = event.target();
		if (this.debug()) {
			log("taskComplete " + task);
		}
		task.removeEventListener(TCD.events.Event.COMPLETE, this.taskCompleteHandler.context(this));
		this._createdTasks.push(task);
		if (this._createdTasks.length == this.tasks().length) {
			this.complete();
		} else {
			this.createTask();
		}
  },
  
  //--------------------------------------
  // Methods
  //--------------------------------------
  
  start: function() {
    this._createdTasks = [];
    if (this.tasks().length > 0) {
      this.createTask();
    } else {
      this.complete();
    }
  },
  
  createTask: function() {
    var index = this._createdTasks.length;
		var task = this.tasks()[index];
		task.addEventListener(TCD.events.Event.COMPLETE, this.taskCompleteHandler.context(this));
		if (this.debug()) {
			log("taskStart " + task);
		}
		task.start();
  },

  toString: function() {
    return '[' + this.qualifiedClassName() + ' name=' + this.name() +']';
  }
};

TCD.Class(TCD.tasks.SequentialTask);
TCD.ui = TCD.ui || {};

//--------------------------------------
// TCD.ui.UIButton
//--------------------------------------

TCD.ui.UIButton = function() {
  this.callSuper();
  this.qualifiedClassName('TCD.ui.UIButton');
};

TCD.ui.UIButton.superclass = TCD.display.DisplayObject;
TCD.ui.UIButton.synthesizedProperties = [];

TCD.ui.UIButton.prototype = {
  
  //--------------------------------------
  // Event Handlers
  //--------------------------------------
  
  mouseOverHandler: function(event) {
    this.$this().addClass('sf-over');
  },
  
  mouseOutHandler: function(event) {
    this.$this().removeClass('sf-over');
  },
  
  clickHandler: function(event) {
  },
  
  mouseUpHandler: function(event) {
    this.$this().removeClass('sf-down');
  },
  
  mouseDownHandler: function(event) {
    this.$this().addClass('sf-down');
  },

  //--------------------------------------
  // Methods
  //--------------------------------------
  
  init: function() {
    this.callSuper();
    
    // add event listeners
    TCD.addListener(this, 'click', 'clickHandler');
    TCD.addListener(this, 'mouseover', 'mouseOverHandler');
    TCD.addListener(this, 'mouseout', 'mouseOutHandler');
    TCD.addListener(this, 'mouseup', 'mouseUpHandler');
    TCD.addListener(this, 'mousedown', 'mouseDownHandler');
  },
  
  toString: function() {
    return '[' + this.qualifiedClassName() + ']';
  }
};

TCD.Class(TCD.ui.UIButton);
TCD.ui = TCD.ui || {};

//--------------------------------------
// TCD.ui.UICarousel
//--------------------------------------

TCD.ui.UICarousel = function() {
  this.callSuper();
  this.qualifiedClassName('TCD.ui.UICarousel');
  this._items = [];
  this._itemHeight = 150;
  this._neighbors = 1;
  this._itemDistance = 160;
  this._speed = 500;
};

TCD.ui.UICarousel.superclass = TCD.display.DisplayObject;
TCD.ui.UICarousel.synthesizedProperties = [
  'items',
  'center',
  'itemHeight',
  'neighbors',
  'itemDistance',
  'positionIndex',
  'startX',
  'centerIndex',
  'speed'
];

TCD.ui.UICarousel.prototype = {

  //--------------------------------------
  // Getters / Setters
  //--------------------------------------
  
  setPositionIndex: function(value) {  
    if (this._positionIndex == value) return;
    
    var oldPositionIndex = this._positionIndex || 0;
    
    var delta = this.items()[oldPositionIndex].carouselIndex() - this.items()[value].carouselIndex();
    var i, len, item, newIndex, newPos, indexFromCenter, opacity, scale;
    
    for (i = 0, len = this.items().length; i < len; i += 1) {
      item = this.items()[i];
      
      // assign new carousel index to item
      newIndex = item.carouselIndex() + delta;
      newIndex = (newIndex < 0 || newIndex >= len) ? (newIndex < 0) ? newIndex + len : newIndex - len : newIndex;
      item.carouselIndex(newIndex);
      item.carousel(this);
      newPos = item.carouselIndex() * this.itemDistance() + startX;
      
      // adjust z-index 
      indexFromCenter = Math.abs(this.centerIndex() - newIndex);
      item.$this().css('z-index', len - indexFromCenter);
      
      // opacity
      opacity = (indexFromCenter <= this.neighbors()) ? 1 : 0;
      
      // scale
      scale = 1 - indexFromCenter * .2;
      
      // animate
      item.animate({
        l: newPos,
        t: this.center().y,
        opacity: opacity,
        scale: scale
      }, {
        duration: this._speed * Math.abs(delta)
      });
    }
    
    this._positionIndex = value; 
  },

  //--------------------------------------
  // Methods
  //--------------------------------------
  
  init: function() {
    this.callSuper();
    
    // set center point
    this.center(new TCD.geom.Point(Math.round(this.w() * 0.5), Math.round(this.h() * 0.5)));
    
    // add class to element
    this.$this().addClass('sf-carousel');
    
    // init items
    var nodeList = this.getElementsByTagName('div');
    var i, len, el;
    for (i = 0, len = nodeList.length; i < len; i += 1) {
      el = nodeList[i];
      el.index(i);
      el.itemHeight(this.itemHeight());
      this.items().push(el);
    }
    
    // position items
    var rightIndex = 1,
        leftIndex = this.items().length - 1,
        xPos = this.center().x,
        yPos = this.center().y,
        centerItem = this.items()[0],
        rightXPos = xPos + this.itemDistance(),
        leftXPos = xPos - this.itemDistance(),
        rightItem, leftItem,
        count = 0,
        opacity;
        
    this.centerIndex(Math.floor(this.items().length * 0.5));
    
    centerItem.l(xPos);
    centerItem.t(yPos);
    centerItem.$this().css('opacity', 1);
    centerItem.carouselIndex(this.centerIndex());

    while (rightIndex <= leftIndex) {
      count++;
      opacity = (count > this.neighbors()) ? 0 : 1;
      rightItem = this.items()[rightIndex];
      
      if (rightItem) {
        rightItem.l(rightXPos);
        rightItem.t(yPos);
        rightItem.carouselIndex(this.centerIndex() + count);
        rightItem.$this().css('opacity', opacity);
        rightXPos += this.itemDistance();
        rightIndex++;
      }
      
      leftItem = this.items()[leftIndex];
      if (leftItem) {
        leftItem.l(leftXPos);
        leftItem.t(yPos);
        leftItem.carouselIndex(this.centerIndex() - count);
        leftItem.$this().css('opacity', opacity);
        
        leftXPos -= this.itemDistance();
        leftIndex--;
      }
    }
    
    startX = leftItem.l();
    
    this.positionIndex(0);
  },
  
  previous: function() {
    var nextIndex = this.positionIndex() - 1;
    nextIndex = (nextIndex < 0) ? this.items().length - 1 : nextIndex;
    this.positionIndex(nextIndex);
  },
  
  next: function() {
    var nextIndex = this.positionIndex() + 1;
    nextIndex = (nextIndex >= this.items().length) ? 0 : nextIndex;
    this.positionIndex(nextIndex);
  },

  toString: function() {
    return '[' + this.qualifiedClassName() + ']';
  }
};

TCD.Class(TCD.ui.UICarousel);
TCD.ui = TCD.ui || {};

//--------------------------------------
// TCD.ui.UICarouselItem
//--------------------------------------

TCD.ui.UICarouselItem = function() {
  this.callSuper();
  this.qualifiedClassName('TCD.ui.UICarouselItem');
  this._itemHeight = 100;
};

TCD.ui.UICarouselItem.superclass = TCD.display.DisplayObject;
TCD.ui.UICarouselItem.synthesizedProperties = [
  'index',
  'carouselIndex',
  'carousel',
  'img',
  'itemHeight',
  'itemWidth'
];

TCD.ui.UICarouselItem.prototype = {

  //--------------------------------------
  // Getters / Setters
  //--------------------------------------
  
  setItemHeight: function(value) {
    this._itemHeight = value;
    
    if (this.img().complete)
      this.scaleAndPositionImage();
  },
  
  setScale: function(value) {
    this._scale = value;
    this.scaleAndPositionImage();
  },
  
  getScale: function() {
    return this._scale;
  },
  
  //--------------------------------------
  // Event Handlers
  //--------------------------------------
  
  imageLoadedHandler: function() {
    this.scaleAndPositionImage();
  },

  //--------------------------------------
  // Methods
  //--------------------------------------
  
  init: function() {
    this.callSuper();
    
    this.img(this.getElementsByTagName('img')[0]);
    
    if (!this.img().complete) {
      TCD.addListener(this.img(), 'load', 'imageLoadedHandler', this);
    } else {
      this.scaleAndPositionImage();
    }
  },
  
  scaleAndPositionImage: function() {
    // scale
    var rect = new TCD.geom.Rectangle(0, 0, this.img().w(), this.img().h());
    var newRect = TCD.utils.RatioUtils.scaleWidth(rect, this._itemHeight * this._scale, true);
    this.img().w(newRect.width());
    this.img().h(newRect.height());
    
    // position
    this.img().l(Math.round(-this.img().w() * 0.5));
    this.img().t(Math.round(-this.img().h() * 0.5));
  },

  toString: function() {
    return '[' + this.qualifiedClassName() + ']';
  }
};

TCD.Class(TCD.ui.UICarouselItem);
TCD.utils = TCD.utils || {};
TCD.utils.ArrayUtils = TCD.utils.ArrayUtils || {};

//--------------------------------------
// getItemByKeys()
//--------------------------------------
// Port of org.casalib.util.ArrayUtil.getItemByKeys() from CASA lib for ActionScript 3.0
// http://casalib.org/

TCD.utils.ArrayUtils.getItemByKeys = function(inArray, keyValues) {
  var i = -1,
      item,
      hasKeys;
  
  while (++i < inArray.length) {
    item = inArray[i];
    hasKeys = true;
    
    for (var j in keyValues) {
      if (!item.hasOwnProperty(j) || item[j] != keyValues[j])
        hasKeys = false;
    }
        
    if (hasKeys)
        return item;
  }
  
  return undefined;
};

//--------------------------------------
// getItemsByKeys()
//--------------------------------------
// Port of org.casalib.util.ArrayUtil.getItemsByKeys() from CASA lib for ActionScript 3.0
// http://casalib.org/

TCD.utils.ArrayUtils.getItemsByKeys = function(inArray, keyValues) {
  var t = [],
      i = -1,
      item,
      hasKeys;
  
  while (++i < inArray.length) {
    item = inArray[i];
    hasKeys = true;
    
    for (var j in keyValues) {
      if (!item.hasOwnProperty(j) || item[j] != keyValues[j])
        hasKeys = false;
    }
        
    if (hasKeys)
        t.push(item);
  }
  
  return t;
};

//--------------------------------------
// getItemByAnyKey()
//--------------------------------------
// Port of org.casalib.util.ArrayUtil.getItemByAnyKey() from CASA lib for ActionScript 3.0
// http://casalib.org/

TCD.utils.ArrayUtils.getItemByAnyKey = function(inArray, keyValues) {
  var i = -1,
      item;
  
  while (++i < inArray.length) {
    item = inArray[i];
    
    for (var j in keyValues) {
      if (!item.hasOwnProperty(j) || item[j] != keyValues[j])
        return item;
    }
  }
  
  return undefined;
};

//--------------------------------------
// getItemsByAnyKey()
//--------------------------------------
// Port of org.casalib.util.ArrayUtil.getItemsByAnyKey() from CASA lib for ActionScript 3.0
// http://casalib.org/

TCD.utils.ArrayUtils.getItemsByAnyKey = function(inArray, keyValues) {
  var t = [],
      i = -1,
      item,
      hasKeys;
  
  while (++i < inArray.length) {
    item = inArray[i];
    hasKeys = true;
    
    for (var j in keyValues) {
      if (!item.hasOwnProperty(j) || item[j] != keyValues[j]) {
        t.push(item);
        
        break;
      }
    }
  }
  
  return t;
};

//--------------------------------------
// getItemByKey()
//--------------------------------------
// Port of org.casalib.util.ArrayUtil.getItemByKey() from CASA lib for ActionScript 3.0
// http://casalib.org/

TCD.utils.ArrayUtils.getItemByKey = function(inArray, key, match) {
  var i, len, item;
  for (var i = 0, len = inArray.length; i < len; i += 1) {
    item = inArray[i];
    if (item.hasOwnProperty(key)) {
      if (item[key] == match) {
        return item;
      }
    }
  }
  
  return undefined;
};

//--------------------------------------
// getItemsByKey()
//--------------------------------------
// Port of org.casalib.util.ArrayUtil.getItemsByKey() from CASA lib for ActionScript 3.0
// http://casalib.org/

TCD.utils.ArrayUtils.getItemsByKey = function(inArray, key, match) {
  var i, len, item,
      t = [];
  for (var i = 0, len = inArray.length; i < len; i += 1) {
    item = inArray[i];
    if (item.hasOwnProperty(key)) {
      if (item[key] == match) {
        t.push(item);
      }
    }
  }
  
  return t;
};
TCD.utils = TCD.utils || {};

// Ported to JS from CasaLib AS3
// http://casalib.org/
TCD.utils.RatioUtils = TCD.utils.RatioUtils || {
  widthToHeight: function(size) {
    return size.width() / size.height();
  },
  
  heightToWidth: function(size) {
    return size.height() / size.width();
  },
  
  scale: function(size, amount, snapToPixel) {
    snapToPixel = snapToPixel || true;
    return TCD.utils.RatioUtils._defineRect(size, size.width() * amount.decimalPercentage(), size.height() * amount.decimalPercentage(), snapToPixel);
  },
  
  /**
   *  Scales the width of an area while preserving aspect ratio.
   *
   *  @param size: The area's width and height expressed as a <code>Rectangle</code>. The <code>Rectangle</code>'s <code>x</code> and <code>y</code> values are ignored.
   *  @param height: The new height of the area.
	 *  @param snapToPixel: Force the scale to whole pixels <code>true</code>, or allow sub-pixels <code>false</code>.
	 */
  scaleWidth: function(size, height, snapToPixel) {
    snapToPixel = snapToPixel || true;
    return TCD.utils.RatioUtils._defineRect(size, height * TCD.utils.RatioUtils.widthToHeight(size), height, snapToPixel);
  },
  
  /**
   *  Scales the height of an area while preserving aspect ratio.
   *
   *  @param size: The area's width and height expressed as a <code>Rectangle</code>. The <code>Rectangle</code>'s <code>x</code> and <code>y</code> values are ignored.
   *  @param width: The new width of the area.
   *  @param snapToPixel: Force the scale to whole pixels <code>true</code>, or allow sub-pixels <code>false</code>.
   */
  scaleHeight: function(size, width, snapToPixel) {
    snapToPixel = snapToPixel || true;
    return TCD.utils.RatioUtils._defineRect(size, width, width * TCD.utils.RatioUtils.heightToWidth(size), snapToPixel);
  },
  
  scaleToFill: function(size, bounds, snapToPixel) {
    snapToPixel = snapToPixel || true;
    var scaled = TCD.utils.RatioUtils.scaleHeight(size, bounds.width(), snapToPixel);
		
		if (scaled.height() < bounds.height())
			scaled = TCD.utils.RatioUtils.scaleWidth(size, bounds.height(), snapToPixel);
		
		return scaled;
  },
  
  scaleToFit: function(size, bounds, snapToPixel) {
    snapToPixel = snapToPixel || true;
    var scaled = TCD.utils.RatioUtils.scaleHeight(size, bounds.width(), snapToPixel);
		
		if (scaled.height() > bounds.height())
			scaled = TCD.utils.RatioUtils.scaleWidth(size, bounds.height(), snapToPixel);
		
		return scaled;
  },
  
  _defineRect: function(size, width, height, snapToPixel) {
    var scaled = size.clone();
    scaled.width(snapToPixel ? Math.round(width) : width);
    scaled.height(snapToPixel ? Math.round(height) : height);
    
    return scaled;
  }
};
TCD.utils = TCD.utils || {};

//--------------------------------------
// Timer
//--------------------------------------

TCD.utils.Timer = function(delay, repeatCount) {
  this.callSuper();
  this.delay(delay);
  this.repeatCount(repeatCount || 0);
  this.qualifiedClassName('TCD.utils.Timer');
  this._interval;
  this._currentCount = 0;
};

TCD.utils.Timer.superclass = TCD.events.EventDispatcher;
TCD.utils.Timer.synthesizedProperties = [
  'currentCount',
  'delay',
  'repeatCount',
  'running'
];

TCD.utils.Timer.prototype = {
  setRunning: function(value) {
    throw new TCD.Error('running is read-only');
  },
  
  setCurrentCount: function(value) {
    throw new TCD.Error('currentCount is read-only');
  },
  
  reset: function() {
    this.stop();
    this._currentCount = 0;
  },
  
  start: function() {
    if (this._interval) return;
    
    if (this.repeatCount() && this.currentCount() >= this.repeatCount()) return;
    
    this._interval = setTimeout(this.tick.context(this), this.delay());
  },
  
  stop: function() {
    if (this._interval) {
      log('clear: ' + this._interval);
      clearTimeout(this._interval);
    }
    
    this._interval = undefined;
  },
  
  tick: function() {
    this._currentCount += 1;
    if (this.repeatCount() && this._currentCount >= this.repeatCount()) {
      this.dispatchEvent(new TCD.utils.TimerEvent(TCD.events.TimerEvent.TIMER_COMPLETE));
      this.reset();
      return;
    }
    
    this._interval = setTimeout(this.tick.context(this), this.delay());
    this.dispatchEvent(new TCD.utils.TimerEvent(TCD.events.TimerEvent.TIMER));
  }
}

TCD.Class(TCD.utils.Timer);
