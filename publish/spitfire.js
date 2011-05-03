var SPITFIRE = SPITFIRE || {};

var $s = $s || SPITFIRE;

SPITFIRE.browser = {  
  Opera: window.opera ? true : false,
  IE: document.all && !this.Opera ? true : false,
  IE6: this.IE && typeof(window.XMLHttpRequest) === "undefined" ? true : false,
  IE8: this.IE && typeof(document.querySelectorAll) !== "undefined" ? true : false,
  IE7: this.IE && ! this.IE6 && !this.IE8 ? true : false,
  WebKit: /WebKit/i.test(navigator.userAgent) ? true : false,
  iPhone: /iPhone|iPod/i.test(navigator.userAgent)? true : false,
  Chrome: /Chrome/i.test(navigator.userAgent) ? true : false,
  Safari: /Safari/i.test(navigator.userAgent) && !this.Chrome ? true : false,
  Konqueror: navigator.vendor === "KDE" ? true : false,
  Konqueror4: this.Konqueror && /native code/.test(document.getElementsByClassName) ? true : false,
  Gecko: !this.WebKit && navigator.product === "Gecko" ? true : false,
  Gecko19: this.Gecko && Array.reduce ? true : false
};

SPITFIRE.isArray = function(obj) {
  return typeof obj === 'object' && obj.length;
};

SPITFIRE.isFunction = function(obj) {
  return typeof obj === 'function';
};

//  Credit: jQuery
//  A crude way of determining if an object is a window
SPITFIRE.isWindow = function(obj) {
		return obj && typeof obj === "object" && 'setInterval' in obj;
};

//  Credit: jQuery
SPITFIRE.isPlainObject = function(obj) {
	// Must be an Object.
	// Because of IE, we also have to check the presence of the constructor property.
	// Make sure that DOM nodes and window objects don't pass through, as well
	if (!obj || typeof obj !== "object" || obj.nodeType || SPITFIRE.isWindow(obj)) {
		return false;
	}
	
	var hasOwn = Object.prototype.hasOwnProperty;

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
};

SPITFIRE.isSynthesizedProperty = function(property, classDefinition) {
  var arr = classDefinition.synthesizedProperties,
      isSynthesizedProperty = false;
  
  if (arr) {
    var i, len;
    for (i = 0, len = arr.length; i < len; i += 1) {
      if (arr[i] === property) {
        isSynthesizedProperty = true;
        break;
      }
    }
  }
  
  return isSynthesizedProperty;
};

SPITFIRE.objectHasMethod = function (obj, method) {
    return obj !== null && obj[method] !== undefined && SPITFIRE.isFunction(obj[method]);
};

SPITFIRE.slice = function(array, startIndex, endIndex) {
  var args = [], i;
  for (i = startIndex; i <= endIndex; i += 1) {
    args.push(array[i]);
  }
  return args;
};

//  Credit: jQuery
//  Augmented to merge accessor methods
SPITFIRE.extend = function() {
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
	if ( typeof target !== "object" && !SPITFIRE.isFunction(target) ) {
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

			  // Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( SPITFIRE.isPlainObject(copy) || (copyIsArray = SPITFIRE.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && SPITFIRE.isArray(src) ? src : [];

					} else {
						clone = src && SPITFIRE.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = SPITFIRE.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

SPITFIRE.addListener = function(target, event, handler, context) {
  context = context || target;
  
  if (SPITFIRE.browser.IE) {
    target.attachEvent('on' + event, handler.context(context));
  } else {
    target.addEventListener(event, handler.context(context), false);
  }
};

SPITFIRE.removeListener = function(target, event, handler, context) {
  context = context || target;
  
  if (SPITFIRE.browser.IE) {
    target.detachEvent('on' + event, handler.context(context));
  } else {
    target.removeEventListener(event, handler.context(context), false);
  }
};

SPITFIRE.merge = function(obj1, obj2) {  
  if (typeof obj1 === 'undefined') return SPITFIRE.clone(obj2);
  if (typeof obj2 === 'undefined') return SPITFIRE.clone(obj1);
  
  var temp;
  temp = SPITFIRE.clone(obj1);
  
  for (var key in obj2) {
    // check to see if key already exists
    if (typeof temp[key] !== 'undefined') {
      // merge the two objects
      temp[key] = SPITFIRE.merge(temp[key], obj2[key]);
    } else {
      temp[key] = SPITFIRE.clone(obj2[key]);
    }
  }
  
  return temp;
}
  
SPITFIRE.clone = function(obj) {
  if (typeof obj !== 'object') return obj;
  
  var temp = {};
  
  for (var key in obj) {
    temp[key] = SPITFIRE.clone(obj[key]);
    temp[key]._name = key;
  }
  
  return temp;
}

//--------------------------------------
// SPITFIRE.extendDOM(selector)
//--------------------------------------

SPITFIRE.extendDOM = function(selector) {
  var $parent = $(selector);
    
  SPITFIRE.extendChildren($parent);
};

//--------------------------------------
// SPITFIRE.extendChild($element)
//--------------------------------------
// Recursively loop through children of given element
// to extend children before the parent

SPITFIRE.extendChildren = function($parent) {
  
  var self = $parent.filter('[sf-base]');
  var children = $parent.children();

  var i, len;
  for (i = 0, len = children.length; i < len; i += 1) {
  	SPITFIRE.extendChildren($(children[i]));
  }
  
  if (self.length) {
    
    var el = self[0];
    var basePath = el.getAttribute('sf-base');

  	// loop through namespace to retrieve class function
  	var nsObjects = basePath.split('.');
  	var j, obj, len2;
  	obj = window;
  	
  	for (j = 0, len2 = nsObjects.length; j < len2; j += 1) {
  		obj = obj[nsObjects[j]];
  	}
  	
  	if (!obj) {
      throw new SPITFIRE.Error('base class not found');
    }
  	
  	var inst = new obj();
  	
  	SPITFIRE.extend(el, inst);
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

SPITFIRE.Class = function(classDefinition) {
  if (classDefinition.isExtended) return;
  
  // create synthesized properties
  if (typeof classDefinition.synthesizedProperties !== 'undefined') {
    
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
    
    var accessorMethodHelper = function(propName) {
      return function() {
        if (arguments.length > 0) {
          // setter
          return this['set' + propName].apply(this, arguments);
        } else {
          // getter
          return this['get' + propName]();
        }
      };
    };
    
    var i, len;
    for (i = 0, len = classDefinition.synthesizedProperties.length; i < len; i += 1) {
      var synProp = classDefinition.synthesizedProperties[i];
      var synPropMethodName = synProp.charAt(0).toUpperCase() + synProp.slice(1);
      
      // create getter / setter methods
      if (!('get' + synPropMethodName in classDefinition.prototype))
        classDefinition.prototype['get' + synPropMethodName] = getterHelper(synProp);
      
      if (!('set' + synPropMethodName in classDefinition.prototype))  
        classDefinition.prototype['set' + synPropMethodName] = setterHelper(synProp);
        
      classDefinition.prototype[synProp] = accessorMethodHelper(synPropMethodName);
    }
  }
  
  // traverse inheritance chain, begin with first
  // parent and apply prototypes and properties to
  // a singular object, inserting function statements
  // when callSuper is called
  
  var obj = {};
  
  (function (classDef) {
    var parent = classDefinition.superclass;
    if (parent) {
      // check for superclass
      if (parent.superclass && !parent.isExtended) {
        arguments.callee(parent.superclass);  // recursively call the annonymous function
      }
      
      obj = extend(parent, obj);
    }
  })(classDefinition);
  
  classDefinition = extend(obj, classDefinition);
  
  // add super powers
  classDefinition.prototype.callSuper = function() {
    var caller = arguments.callee.caller,
        superMethod = caller._super;
    
    // check to see if caller is a constructor
    // if so call it's superclass    
    if (typeof caller.superclass !== 'undefined') {
      caller.superclass.apply(this, arguments);
    } else 
    
    // check to see if a super method is available
    if (typeof superMethod !== 'undefined') {
      return superMethod.apply(this, arguments);
    }
  };
  
  classDefinition.isExtended = true;
  
  function extend(supr, classDef) {
    classDef.prototype = merge(classDef.prototype, supr.prototype);
    
    return classDef;
  }
  
  function merge(classDef, supr) {
    var temp,
        pattern = /callSuper/ig;
    if (typeof classDef !== 'undefined') {
      temp = SPITFIRE.clone(classDef);
      
      for (var key in supr) {
        // check to see if method exists
        // if so save super method as a _super property
        // of the current method
        if (typeof temp[key] !== 'undefined') {
          // check to see if there is a callSuper method
          if (temp[key].toString().search(pattern) !== -1) {
            temp[key]._super = supr[key];
          }
        } else {
          temp[key] = supr[key];
        }
      }
    } else {
      temp = SPITFIRE.clone(supr);
    }
    
    return temp;
  }
};
//--------------------------------------
// Object
//--------------------------------------

SPITFIRE.Object = function() {
  this.setQualifiedClassName('SPITFIRE.Object');
};

SPITFIRE.Object.synthesizedProperties = ['qualifiedClassName'];

SPITFIRE.Object.prototype = {
  init: function() {
  
  }
}

SPITFIRE.Class(SPITFIRE.Object);
//--------------------------------------
// Error
//--------------------------------------

SPITFIRE.Error = function(message) {
  this.callSuper();
  this.setMessage(message);
  this.setName('Error');
  this.setQualifiedClassName('SPITFIRE.Error');
};

SPITFIRE.Error.superclass = SPITFIRE.Object;
SPITFIRE.Error.synthesizedProperties = ['message', 'name'];

SPITFIRE.Error.prototype = {
  toString: function() {
    return this.getName() + ': [' + this.getQualifiedClassName() + '] "' + this.getMessage() + '"';
  }
}

SPITFIRE.Class(SPITFIRE.Error);
//--------------------------------------
// Event
//--------------------------------------

SPITFIRE.Event = function(type, data, bubbles, cancelable) {
  this.setBubbles(bubbles || false);
  this.setCancelable(cancelable || false);
  this.setData(data || {});
  this.setType(type);
};

SPITFIRE.Event.COMPLETE = 'complete';
SPITFIRE.Event.CHANGE = 'change';

SPITFIRE.Event.synthesizedProperties = ['bubbles', 'cancelable', 'data', 'target', 'type'];
SPITFIRE.Event.superclass = SPITFIRE.Object;
SPITFIRE.Class(SPITFIRE.Event);
//--------------------------------------
// EventDispatcher
//--------------------------------------

SPITFIRE.EventDispatcher = function() {
  this.callSuper();
  this.setQualifiedClassName('SPITFIRE.EventDispatcher');
  this._eventListeners = {};
};

SPITFIRE.EventDispatcher.superclass = SPITFIRE.Object;

SPITFIRE.EventDispatcher.prototype = {
  bind: function(type, handler) {
    if (!this._eventListeners[type]) {
      this._eventListeners[type] = [];
    }
    this._eventListeners[type].push(handler);
  },
  
  unbind: function(type, handler) {
    for (var i = 0, len = this._eventListeners[type].length; i < len; i++) {
      if (this._eventListeners[type][i] == handler) {
        this._eventListeners[type].splice(i, 1);
      }
    }
  },
  
  trigger: function(event) {
    event.setTarget(this);
    var args = [event];
    
    if (this._eventListeners[event.getType()]) {
      for (var j = 0, len = this._eventListeners[event.getType()].length; j < len; j++) {
        this._eventListeners[event.getType()][j].apply(this, args);
      }
    }
  }
};

SPITFIRE.Class(SPITFIRE.EventDispatcher);
//--------------------------------------
// SPITFIRE.DisplayObject
//--------------------------------------

SPITFIRE.DisplayObject = function($el) {
  this.callSuper();
  this.setQualifiedClassName('SPITFIRE.DisplayObject');
  this._scaleX = 1;
  this._scaleY = 1;
  this._scale = 1;
  this._placeholderProperties = [];
  this._z = 1;
  this._$this = $el;
  this._isCentered = false;
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
  'z',
  'isCentered'
];

SPITFIRE.DisplayObject.prototype = {

  //--------------------------------------
  // Getters / Setters
  //--------------------------------------
  
  setL: function(value) {
    this._$this.css('left', value);
  },
  
  getL: function() {
    var flt = (this.style && this.style.left) ? parseFloat(this.style.left) : parseFloat(this._$this.css('left'));
    return flt || 0;
  },
  
  setT: function(value) {
    this._$this.css('top', value);
  },
  
  getT: function() {
    var flt = (this.style && this.style.top) ? parseFloat(this.style.top) : parseFloat(this._$this.css('top'));
    return flt || 0;
  },
  
  getW: function() {
    return (this._w) ? this._w * this._scaleX : this._$this.width();
  },
  
  setW: function(value) {
    this._w = value || 270;
    this._$this.width(this._w * this._scaleX);
    
    if (this._isCentered) this.setL(~~(-this._$this.width() * 0.5));
  },

  getH: function() {
    return (this._h) ? this._h * this._scaleY : this._$this.height();
  },
  
  setH: function(value) {
    this._h = value;
    this._$this.height(this._h * this._scaleY);
    
    if (this._isCentered) this.setT(~~(-this._$this.height() * 0.5));
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
    this._$this.css('z-index', this._z);
  },
  
  //--------------------------------------
  // Methods
  //--------------------------------------
  
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
    
    this._$this.animate(properties, options);
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
  }
};

SPITFIRE.Class(SPITFIRE.DisplayObject);
//--------------------------------------
// SPITFIRE.Task
//--------------------------------------

SPITFIRE.Task = function() {
  this.callSuper();
  this.setQualifiedClassName('SPITFIRE.Task');
  this.setProgress(0);
};

SPITFIRE.Task.superclass = SPITFIRE.EventDispatcher;
SPITFIRE.Task.synthesizedProperties = [
  'progress',
  'progressive',
  'name',
  'debug'
];

SPITFIRE.Task.prototype = {
  //--------------------------------------
  // Methods
  //--------------------------------------
  
  start: function() {
    this.setProgress(0);
  },
  
  complete: function() {
    this.setProgress(1);
    this.trigger(new SPITFIRE.Event(SPITFIRE.Event.COMPLETE));
  },
  
  toString: function() {
    return '[' + this.getQualifiedClassName() + ' name=' + this.getName() + ']';
  }
};

SPITFIRE.Class(SPITFIRE.Task);
//--------------------------------------
// SPITFIRE.TaskManager
//--------------------------------------

SPITFIRE.TaskManager = function() {
  this._progressiveTasks = [];
  this._createdTasks = [];
  this._tasks = [];
  
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.TaskManager');
};

SPITFIRE.TaskManager.superclass = SPITFIRE.Task;
SPITFIRE.TaskManager.synthesizedProperties = ['tasks'];

SPITFIRE.TaskManager.prototype = {
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
			throw new SPITFIRE.Error("The supplied task must be a child of the caller.");
		}

		return this.tasks().indexOf(task);
  },
  
  removeTask: function(task) {
    if (!this.contains(task)) {
			throw new SPITFIRE.Error("The supplied task must be a child of the caller.");
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
			throw new SPITFIRE.Error("The supplied task must be a child of the caller.");
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

SPITFIRE.Class(SPITFIRE.TaskManager);
//--------------------------------------
// SPITFIRE.State
//--------------------------------------

SPITFIRE.State = function(name) {
  this.callSuper();
  this.setName(name);
  this._children = [];
  this._selected = false;
  this.setQualifiedClassName('SPITFIRE.State');
};

SPITFIRE.State.superclass = SPITFIRE.EventDispatcher;
SPITFIRE.State.synthesizedProperties = [
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

SPITFIRE.State.prototype = {
  //--------------------------------------
  // Getters / Setters
  //--------------------------------------
  
  setRoot: function(value) {
    this._root = value;
    for (var i = 0, len = this._children.length; i < len; i+=1) {
      this._children[i].setRoot(this._root);
    }
  },
  
  setStateManager: function(value) {
    this._stateManager = value;
    for (var i = 0, len = this._children.length; i < len; i+=1) {
      this._children[i].setStateManager(this.stateManager());
    }
  },
  
  setChildren: function(value) {
    for (var i = 0, len = this._children.length; i < len; i+=1) {
      this.removeChild(this._children[i]);
    }
    
    this._children = [];
    
    for (i = 0, len = value.length; i < len; i++) {
      this.addChild(value[i]);
    }
  },
  
  setSelectedChild: function(value) {
    if (!this.contains(value)) {
      throw new SPITFIRE.Error('The supplied child must be a child of the caller.');
    }
    
    this._selectedChild = value;
  },
  
  getActivatedChild: function() {
    var state, i, len;
    for (i = 0, len = this._children.length; i < len; i+=1) {
      child = this._children[i];
      if (child.activated) {
        state = child;
        break;
      }
    }
    return state;
  },
  
  getNumChildren: function() {
    return this._children.length;
  },
  
  getSelectedChildIndex: function() {
    var index;
    if (this._selectedChild) {
      index = this.getChildIndex(this._selectedChild);
    }
    
    return index;
  },
  
  setSelectedChildIndex: function(value) {
    var child = this.getChildAt(value);
    this.setSelectedChild(child);
  },
  
  setSelected: function(value) {
    if (value != this._selected) {
      this._selected = value;
      this.trigger(new SPITFIRE.StateEvent(SPITFIRE.StateEvent.STATE_CHANGE));
    }
  },
  
  getIndex: function() {
    return this.getParent().getChildIndex(this);
  },
  
  getStateLocation: function() {
    var locationArray = [],
        state = this,
        location = '',
        i, len, inlineState;
    
    while (state) {
      locationArray.push(state);
      state = state.getParent();
    }
    
    locationArray.reverse();
    
    for (i = 0, len = locationArray.length; i < len; i+=1) {
      inlineState = locationArray[i];
      location += inlineState.getName();
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
    var child = event.getTarget();
    if (child.getSelected()) {
      this._selectedChild = child;
    } else
    if (child == this._selectedChild) {
      this._selectedChild = undefined;
    }
    
    this.trigger(new SPITFIRE.StateEvent(SPITFIRE.StateEvent.CHILD_STATE_CHANGE));
  },
  
  //--------------------------------------
  // Methods
  //--------------------------------------
  
  addChild: function(child) {
    child.setParent(this);
    child.setStateManager(this.getStateManager());
    child.setRoot(this._root);
    this._children.push(child);
    child.bind(SPITFIRE.StateEvent.STATE_CHANGE, this.childChangeHandler.context(this));
  },
  
  addChildAt: function(child, index) {
    child.setParent(this);
    child.setStateManager(this.getStateManager());
    child.setRoot(this._root);
    this._children.splice(index, 0, child);
    child.bind(SPITFIRE.StateEvent.STATE_CHANGE, this.childChangeHandler.context(this));
    return child;
  },
  
  contains: function(child) {
    return this._children.indexOf(child) != -1;
  },
  
  getChildAt: function(index) {
    return this._children[index];
  },
  
  getChildByName: function(name) {
    var foundChild, i, len, child;
    for (i = 0, len = this._children.length; i < len; i+=1) {
      child = this._children[i];
      if (child.getName() == name) {
        foundChild = child;
        break;
      }
    }
    
    return foundChild;
  },
  
  getChildIndex: function(child) {
    if (!this.contains(child)) {
      throw new SPITFIRE.Error('The supplied child must be a child of the caller.');
    }
    
    return this._children.indexOf(child);
  },
  
  removeChild: function(child) {
    if (!this.contains(child)) {
      throw new SPITFIRE.Error('The supplied child must be a child of the caller.');
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
    child.unbind(SPITFIRE.StateEvent.STATE_CHANGE, this.childChangeHandler.context(this));
    this._children.splice(index, 1);
    return child;
  },
  
  setChildIndex: function(child, index) {
    if (!this.contains(child)) {
      throw new SPITFIRE.Error('The supplied child must be a child of the caller.');
    }
    
    var childIndex = this.getChildIndex(child);
    this._children.splice(index, 0, this._children[childIndex]);
    this._children.splice(childIndex, 1);
  },
  
  swapChildrenAt: function(index1, index2) {
    var temp = this._children[index1];
    this._children[index1] = this._children[index2];
    this._children[index2] = temp;
  },
  
  setSelectedChildByName: function(name) {
    var foundChild, i, len, child;
    for (i = 0, len = this._children.length; i < len; i+=1) {
      child = this._children[i];
      if (child.getName() == name) {
        foundChild = child;
        break;
      }
    }
    
    if (foundChild) {
      this.setSelectedChild(foundChild);
    } else {
      throw new SPITFIRE.Error('The supplied child must be a child of the caller.');
    }
  },
  
  browse: function() {
    var location = this.getStateLocation() + this.findDefaultStates();
    this.stateManager().setLocation(location);
  },
  
  findDefaultStates: function() {
    var states = [];
    var defaultState = this.getChildByName(this.getDefaultChild());
    
    while (defaultState) {
      states.push(defaultState);
      defaultState = defaultState.getChildByName(defaultState.getDefaultChild());
    }
    
    var location = '',
        i, len;
    for (i = 0, len = states.length; i < len; i += 1) {
    	if (i === 0) {
        location += '/';
    	}
    	
    	var state = states[i];
    	location += state.getName();
    	
    	if (i < states.length - 1) {
        location += '/';
    	}
    }
    
    return location;
  },
  
  browsePreviousSibling: function() {
    var previousIndex = this.index - 1;
    if (previousIndex < 0) {
      previousIndex = this.getParent().getChildren().length - 1;
    }
    
    this.getParent().getChildAt(previousIndex).browse();
  },
  
  browseNextSibling: function() {
    var nextIndex = index + 1;
    
    if (nextIndex > this.getParent().getChildren().length - 1) {
      nextIndex = 0;
    }
    
    this.getParent().getChildAt(nextIndex).browse();
  },
  
  browsePreviousChild: function() {
    var previousIndex = this.getSelectedChildIndex() - 1;
    
    if (previousIndex < 0) {
      previousIndex = this._children.length - 1;
    }
    
    this.getChildAt(previousIndex).browse();
  },
  
  browseNextChild: function() {
    var nextIndex = this.getSelectedChildIndex() + 1;
    
    if (nextIndex > this._children.length - 1) {
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
      throw new SPITFIRE.Error(this + ': no child class defined');
    }
    
    var state = new this.getChildClass();
		state.setName(value);
		this.addChild(state);
		return state;
  },
  
  toString: function() {
    return '[State' + ' name=' + this.getName() + ' title=' + this.getTitle() + ' className=' + this.getQualifiedClassName() + ' defaultChild=' + this.getDefaultChild()  + ']';
  }
};

SPITFIRE.Class(SPITFIRE.State);
//--------------------------------------
// SPITFIRE.ModelEvent
//--------------------------------------

SPITFIRE.ModelEvent = function(type, data, bubbles, cancelable) {
  this.callSuper(type, data, bubbles, cancelable);
};

SPITFIRE.ModelEvent.DATA_UPDATE = 'dataUpdate';

SPITFIRE.ModelEvent.superclass = SPITFIRE.Event;
SPITFIRE.Class(SPITFIRE.ModelEvent);
//--------------------------------------
// SPITFIRE.StateEvent
//--------------------------------------

SPITFIRE.StateEvent = function(type, data, bubbles, cancelable) {
  this.callSuper(type, data, bubbles, cancelable);
};

SPITFIRE.StateEvent.CHILD_STATE_CHANGE = 'childStateChange';
SPITFIRE.StateEvent.STATE_CHANGE = 'stateChange';
SPITFIRE.StateEvent.STATE_ACTIVATED = 'stateActivated';

SPITFIRE.StateEvent.superclass = SPITFIRE.Event;
SPITFIRE.Class(SPITFIRE.StateEvent);
//--------------------------------------
// StateManagerEvent
//--------------------------------------

SPITFIRE.StateManagerEvent = function(type, data, bubbles, cancelable, state) {
  this.callSuper(type, data, bubbles, cancelable);
  this.setState(state);
  this.setQualifiedClassName('SPITFIRE.StateManagerEvent');
};

SPITFIRE.StateManagerEvent.LOAD_IN_START = 'loadInStart';
SPITFIRE.StateManagerEvent.LOAD_IN_COMPLETE = 'loadInComplete';
SPITFIRE.StateManagerEvent.TRANSITION_IN_START = 'transitionInStart';
SPITFIRE.StateManagerEvent.TRANSITION_IN_COMPLETE = 'transitionInComplete';
SPITFIRE.StateManagerEvent.LOAD_OUT_START = 'loadOutStart';
SPITFIRE.StateManagerEvent.LOAD_OUT_COMPLETE = 'loadOutComplete';
SPITFIRE.StateManagerEvent.TRANSITION_OUT_START = 'transitionOutStart';
SPITFIRE.StateManagerEvent.TRANSITION_OUT_COMPLETE = 'transitionOutComplete';
SPITFIRE.StateManagerEvent.TRANSITION_IN_STATE_COMPLETE = 'transitionInStateComplete';
SPITFIRE.StateManagerEvent.TRANSITION_OUT_STATE_COMPLETE = 'transitionOutStateComplete';
SPITFIRE.StateManagerEvent.LOAD_IN_STATE_COMPLETE = 'loadInStateComplete';
SPITFIRE.StateManagerEvent.LOAD_OUT_STATE_COMPLETE = 'loadOutStateComplete';
SPITFIRE.StateManagerEvent.DEEPLINK = 'deeplink';

SPITFIRE.StateManagerEvent.superclass = SPITFIRE.Event;
SPITFIRE.StateManagerEvent.synthesizedProperties = ['state'];
SPITFIRE.Class(SPITFIRE.StateManagerEvent);
//--------------------------------------
// TimerEvent
//--------------------------------------

SPITFIRE.TimerEvent = function(type, data, bubbles, cancelable) {  
  this.callSuper(type, data, bubbles, cancelable);
  this.setQualifiedClassName('SPITFIRE.TimerEvent');
};

SPITFIRE.TimerEvent.TIMER = 'timer';
SPITFIRE.TimerEvent.TIMER_COMPLETE = 'timerComplete';

SPITFIRE.TimerEvent.superclass = SPITFIRE.Event;
SPITFIRE.Class(SPITFIRE.TimerEvent);
//--------------------------------------
// SPITFIRE.Point
//--------------------------------------

SPITFIRE.Point = function(x, y) {
  this.callSuper();
  this.setQualifiedClassName('SPITFIRE.Point');
  this.x = x;
  this.y = y;
};

SPITFIRE.Point.superclass = SPITFIRE.Object;

SPITFIRE.Point.prototype = {  
  //--------------------------------------
  // Methods
  //--------------------------------------

  toString: function() {
    return '[' + this.getQualifiedClassName() + '] x:' + this.x + ' y:' + this.y;
  }
};

SPITFIRE.Class(SPITFIRE.Point);
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
    this._percent = value * .01;
  },
  
  getDecimalPercentage: function() {
    return this._percent;
  },
  
  setDecimalPercentage: function(value) {
    this._percent = value;
  },
  
  equals: function(percent) {
    return this.getDecimalPercentage() == percent.getDecimalPercentage();
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
//--------------------------------------
// SPITFIRE.Model
//--------------------------------------

SPITFIRE.Model = function() {
  this.callSuper();
  this.setQualifiedClassName('SPITFIRE.Model');
};

SPITFIRE.Model.superclass = SPITFIRE.EventDispatcher;
SPITFIRE.Model.synthesizedProperties = ['data'];

SPITFIRE.Model.prototype = {

  //--------------------------------------
  // Getters / Setters
  //--------------------------------------
  
  setData: function(value) {
    this._data = value;
    this.trigger(new SPITFIRE.ModelEvent(SPITFIRE.ModelEvent.DATA_UPDATE));
  },

  //--------------------------------------
  // Methods
  //--------------------------------------

  toString: function() {
    return '[' + this.getQualifiedClassName() + ']';
  }
};

SPITFIRE.Class(SPITFIRE.Model);
//--------------------------------------
// SPITFIRE.DisplayState
//--------------------------------------

SPITFIRE.DisplayState = function(name, config) {
  this.callSuper(name);
  this.qualifiedClassName('SPITFIRE.DisplayState');
  
  var defaultConfig = {
    id: '',
    assets: {
      view: '',
      stylesheets: [],
      images: []
    }
  }
  
  var configuration = config || defaultConfig;
  this.config(configuration);
  this.stylesheets([]);
  this.images([]);
  this._addedDOMAssets = [];
  this._isCached = false;
};

SPITFIRE.DisplayState.superclass = SPITFIRE.State;
SPITFIRE.DisplayState.synthesizedProperties = [
  'view',
  'stylesheets',
  'images',
  'config',
  'isCached'
];

SPITFIRE.DisplayState.prototype = {

  //--------------------------------------
  // Getters / Setters
  //--------------------------------------
  
  getLoadIn: function() {
    // don't load if already cached
    if (this.getIsCached()) return undefined;
    
    var sequentialTask = new SPITFIRE.SequentialTask(),
        i, len, task;
    
    // load view
    var configView = this.config().assets.view;
    
    if (configView && configView != '') {
      this.view(new SPITFIRE.JQueryAjaxTask(configView));
      sequentialTask.addTask(this.view());
    }
    
    // load stylesheets
    var configStylesheets = this.config().assets.stylesheets;
    
    if (configStylesheets.length > 0) {
      for (i = 0, len = configStylesheets.length; i < len; i += 1) {
      	var stylesheet = configStylesheets[i];
      	task = new SPITFIRE.JQueryAjaxTask(stylesheet);
      	this.stylesheets().push(task);
      	sequentialTask.addTask(task);
      }
    }
    
    // load images
    var configImages = this.config().assets.images;
    if (configImages.length > 0) {
      for (i = 0, len = configImages.length; i < len; i += 1) {
      	var img = configImages[i];
      	task = new SPITFIRE.JQueryAjaxTask(img);
      	this.images().push(task);
      	sequentialTask.addTask(task);
      }
    }
    
    sequentialTask.addTask(new SPITFIRE.FunctionTask(this, this.addDOMAssets));
    return sequentialTask;
  },
  
  getTransitionOut: function() {
    return new SPITFIRE.FunctionTask(this, this.cleanUp);
  },
  
  //--------------------------------------
  // Methods
  //--------------------------------------
  
  addDOMAssets: function() {
    
    // add stylesheets to DOM
    var i, len, $obj, style, rules,
        head = document.getElementsByTagName('head')[0];
    
    if (this.stylesheets().length > 0) {
      for (i = 0, len = this.stylesheets().length; i < len; i += 1) {
      	style = document.createElement('style');
      	style.type = 'text/css';
      	rules = document.createTextNode(this.stylesheets()[i].content());
      	
      	if (style.styleSheet) {
          style.styleSheet.cssText = rules.nodeValue;
        } else {
          style.appendChild(rules);
        }
        
      	head.appendChild(style);
        this._addedDOMAssets.push(style);
      }
    }
    
    // add view to DOM
    if (this.view()) {
      $obj = $(this.view().content()).appendTo('body');
      this._addedDOMAssets.push($obj);
    }
    
    this.setIsCached(true);
  },
  
  removeDOMAssets: function() {
    while (this._addedDOMAssets.length > 0) {
      // check for jQuery objects
      var obj = this._addedDOMAssets[0];
      if (typeof obj.remove === 'function') {
        obj.remove();
      } else {
        // raw js
      }
      this._addedDOMAssets.shift();
    }
  },
  
  cleanUp: function() {
  
  },

  toString: function() {
    return '[' + this.qualifiedClassName() + ']';
  }
};

SPITFIRE.Class(SPITFIRE.DisplayState);
//--------------------------------------
// Redirect
//--------------------------------------

SPITFIRE.Redirect = function(location, newLocation) {
  this.callSuper();
  this.setQualifiedClassName('SPITFIRE.Redirect');
  this.setLocation(location);
  this.setNewLocation(newLocation);
}

SPITFIRE.Redirect.superclass = SPITFIRE.Object;
SPITFIRE.Redirect.synthesizedProperties = ['location', 'newLocation'];

SPITFIRE.Class(SPITFIRE.Redirect);
//--------------------------------------
// SPITFIRE.StateManager
//--------------------------------------

SPITFIRE.StateManager = function(name, root) {
  this.callSuper();
  this.setRoot(root);
  this.setQualifiedClassName('SPITFIRE.StateManager');
  this.setName(name || this.getQualifiedClassName() + ~~(Math.random() * 100000));
  this.setPageViewType(SPITFIRE.StateManager.PAGE_VIEW_LOCATION);
  this._progressTimer = new SPITFIRE.Timer(33);
  this._progressTimer.bind(SPITFIRE.TimerEvent.TIMER, this.taskManagerProgressHandler.context(this));
  this._transitionInPath;
  this._transitionWasInterrupted;
  this._isInTransition;
  this._transitions;
  this._currentTransition;
  this._redirects = [];
};

SPITFIRE.StateManager.PAGE_VIEW_LOCATION = 'pageViewLocation';
SPITFIRE.StateManager.PAGE_VIEW_NAME = 'pageViewName';

SPITFIRE.StateManager.superclass = SPITFIRE.EventDispatcher;
SPITFIRE.StateManager.synthesizedProperties = [
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

SPITFIRE.StateManager.prototype = {
  //--------------------------------------
  // Getters / Setters
  //--------------------------------------
  
  setDeepLinking: function(value) {
    this._deepLinking = value;
    if (this.getDeepLinking()) {
      this.getDeepLinking().change(this.deepLinkingChangeHandler.context(this));
    }
  },
  
  setTree: function(value) {
    this._tree = value;
    value.setStateManager(this);
    value.setRoot(this.root());
  },
  
  getLocation: function() {
    var states = this.getSelectedStates(),
        loc = '',
        i, len;
        
    for (i = 0, len = states.length; i < len; i+=1) {
      var inlineState = states[i];
      loc += inlineState.getName();
      if (inlineState != states[states.length - 1]) {
        loc += '/';
      }
    }
    
    return loc;
  },
  
  setLocation: function(value) {
    if (this.getDeepLinking()) {
      var array = value.split('/');
      array.shift();
      var loc = '/' + array.join('/');
      this.getDeepLinking().value(loc);
    } else {
      var locationArray = value.split('/');
      locationArray.shift();
      var state = this.getTree();
      if (locationArray.length > 0) {
        state = state.getChildFromPath(locationArray.join('/'));
      }
      
      this._transitionInPath = state.getStateLocation();
      this.checkIfInTransition();
    }
  },
  
  getSelectedStates: function() {
    var states = [],
        state;
        
    if (this.getTree().getSelected()) {
      state = this.getTree();
    }
    
    while (state) {
      states.push(state);
      state = state.getSelectedChild();
    }
    
    return states;
  },
  
  //--------------------------------------
  // Event Handlers
  //--------------------------------------
  
  deepLinkingChangeHandler: function(event) {
    var path = this.getDeepLinking().value();
    if (path == '' || path == '/') {
      this._transitionInPath = this.getTree().getStateLocation();
    } else {
      this._transitionInPath = this.getTree().getName() + path;
    }
    
    this.checkIfInTransition();
  },
  
  taskManagerProgressHandler: function(event) {
    var totalProgress = this.getTaskManager().getProgress();
    if (this.getDebug()) {
      log(this.getName() + ' totalProgress = ' + totalProgress);
    }
    
    if (isNaN(totalProgress)) {
      totalProgress = 0;
    }
    
    if (typeof this.getPreloader() !== 'undefined') {
      this.getPreloader().setProgress(totalProgress);
    }
  },
    
  transitionInCompleteHandler: function(event) {
    if (this.getTrackPageViews()) {
  		var param;
  		switch(this.getPageViewType()) {
  			case SPITFIRE.StateManager.PAGE_VIEW_LOCATION:
  				param = this.getLocation();
  			break;
  			case SPITFIRE.StateManager.PAGE_VIEW_NAME:
  				param = this.getLocation();
  			break;
  		}
  	}
  },
  
  taskManagerCompleteHandler: function(event) {
    this.getTaskManager().unbind(SPITFIRE.Event.COMPLETE, this.taskManagerCompleteHandler.context(this));
		if (this.getTaskManager().getProgressive()) {
			this.taskManagerProgressHandler();
			this._progressTimer.stop();
		}
		this.trigger(new SPITFIRE.Event(this._currentTransition.transitionName() + "Complete"));
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
    if (this.getDeepLinking()) {
      if (this.getDeepLinking().value() != '/') {
        this.deepLinkingChangeHandler();
      } else
      if (this.getStartLocation()) {
        this.location(this.getStartLocation());
      } else {
        this._transitionInPath = this.getTree().getStateLocation();
        this.checkIfInTransition(); 
      }
    } else 
    if (this.getStartLocation()) {
      this.location(this.getStartLocation());
    } else {
      this._transitionInPath = this.getTree().getStateLocation();
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
    this._isInTransition = true;
    
    this._transitionInPath = this.checkRedirect(this._transitionInPath);
    
    var nextLocationArray = this._transitionInPath.split('/');
    
    var locationPathArray = [];
    if (this.getLocation().length > 0) {
      locationPathArray = this.getLocation().split('/');
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
    
    this._transitions.push(new SPITFIRE.TransitionProperties(transitionOutPaths.slice(), 'loadOut', false));
    this._transitions.push(new SPITFIRE.TransitionProperties(transitionOutPaths.slice(), 'transitionOut', false));
    
    var transitionInPaths = [];
    for (i = breakIndex, len = nextLocationArray.length; i < len; i+=1) {
      nextArray = nextLocationArray.slice(0, i + 1);
      transitionInPaths.push(nextArray.join('/'));
    }

    transitionInPaths = this.activateStates(transitionInPaths);

    if (transitionInPaths.length == 0) {
      transitionInPaths = this.checkForDefaultStates(this._transitionInPath);
    }
    
    this._transitions.push(new SPITFIRE.TransitionProperties(transitionInPaths.slice(), 'loadIn', false));
    this._transitions.push(new SPITFIRE.TransitionProperties(transitionInPaths.slice(), 'transitionIn', false));
    
    this.startTransition();
  },
  
  deactivateStates: function(transitionPaths) {
    var i, len;
    for (i = 0, len = transitionPaths.length; i < len; i+=1) {
      var path = transitionPaths[i];
      var pathArray = path.split('/');
      pathArray.shift();
      var state = this.getTree();
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
			var state = this.getTree();
			
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
			
			state.setActivated(true);
			this.getActiveStates().push(state);
			newPaths.push(state.getStateLocation());
			
			if (state.getStateLocation() == transitionPaths[transitionPaths.length - 1]) {
				var defaultState = state.getChildByName(state.defaultChild());
				while (defaultState) {
					defaultState.setActivated(true);
					this.getActiveStates().push(defaultState);
					newPaths.push(defaultState.getStateLocation());
					defaultState = defaultState.getChildByName(defaultState.getDefaultChild());
				}
			}
			
		}
		
		return newPaths;
  },
  
  checkForDefaultStates: function(path) {
    var newPaths = [];
		var pathArray = path.split("/");
		pathArray.shift();
		var state = this.getTree();
		if (pathArray.length > 0) {
		  var i, len;
			for (i = 0, len = pathArray.length; i < len; i += 1) {
				var currentState = state;
				state = currentState.getChildByName(pathArray[i]);
			}
		}
		var defaultState = state.getChildByName(state.defaultChild);
		while (defaultState) {
			defaultState.setActivated(true);
			this.getActiveStates().push(defaultState);
			newPaths.push(defaultState.getStateLocation());
			defaultState = defaultState.getChildByName(defaultState.getDefaultChild());
		}
		
		return newPaths;
  },
  
  startTransition: function() {
    this._currentTransition = this._transitions.shift();
		this.trigger(new SPITFIRE.Event(this._currentTransition.getTransitionName() + "Start"));
		
		this.setTaskManager(new SPITFIRE.SequentialTask());
		
		this.getTaskManager().setName(this._currentTransition.getTransitionName());
		if (this.getDebug()) {
			this.getTaskManager().setDebug(this.getDebug());
		}
		
		this.getTaskManager().bind(SPITFIRE.Event.COMPLETE, this.taskManagerCompleteHandler.context(this));
		
		var i, len;
		
		for (i = 0, len = this._currentTransition.getLocations().length; i < len; i += 1) {
		  var path = this._currentTransition.getLocations()[i];
			var pathArray = path.split("/");
			pathArray.shift();
			var state = this.getTree();
			if (pathArray.length > 0) {
				state = state.getChildFromPath(pathArray.join("/"));
			}
			var task = state[this._currentTransition.getTransitionName()]();
			
			if (task) {
				this.getTaskManager().addTask(task);
			}
			var stateSelected = false;;
			if (this._currentTransition.getTransitionName() == "transitionIn") {
				stateSelected = true;
			}
			if (this._currentTransition.getTransitionName() == "transitionOut") {
				stateSelected = false;
			}

			this.getTaskManager().addTask(new SPITFIRE.PropertyTask(state, "selected", stateSelected));
		}
		if (this.getTaskManager().getProgress() == 1) {
			this.getTaskManager().getProgressive(false);
		}
		if (this.getTaskManager().getProgressive()) {
			if (this.getPreloader()) {
				this.getTaskManager().addTaskAt(new SPITFIRE.PropertyTask(this.getPreloader(), "progress", 0), 0);
				this.getTaskManager().addTaskAt(this.getPreloader().getTransitionIn(), 1);
				this.getTaskManager().addTask(this.getPreloader().getTransitionOut());
			}
			this.getTaskManager().setProgress(0);
			this._progressTimer.start();
		}
		this.getTaskManager().start();
  },
  
  addRedirect: function(location, newLocation) {
    this.removeRedirect(location);
		this.redirects.push(new SPITFIRE.Redirect(location, newLocation));
  },
  
  removeRedirect: function(location) {
    var newRedirects = [];
    var i, len;
		for (i = 0, len = this.getRedirects().length; i < len; i += 1) {
		  var redirect = this.getRedirects()[i];
			if (redirect.getLocation() != location) {
				newRedirects.push(redirect);
			}
		}
		this.setRedirects(newRedirects);
  },
  
  checkRedirect: function(path) {
    var i, len;
		for (i = 0, len = this.getRedirects().length; i < len; i += 1) {
		  var redirect = this.getRedirects()[i];
			if (path == redirect.getLocation()) {
				path = redirect.getNewLocation();
			}
		}
		
		return path;
  },
  
  toString: function() {
    return '[StateManager' + ' name=' + this.getName() + ' className = ' + this.getQualifiedClassName() + ']';
  }
};

SPITFIRE.Class(SPITFIRE.StateManager);
//--------------------------------------
// SPITFIRE.TransitionProperties
//--------------------------------------

SPITFIRE.TransitionProperties = function(locations, transitionName, showPreloader) {
  this.callSuper();
  this.locations(locations);
  this.transitionName(transitionName);
  this.showPreloader(showPreloader);
}

SPITFIRE.TransitionProperties.superclass = SPITFIRE.Object;
SPITFIRE.TransitionProperties.synthesizedProperties = ['locations', 'transitionName', 'showPreloader', 'currentState'];

SPITFIRE.TransitionProperties.prototype = {
  toString: function() {
    return this.transitionName();
  }
}

SPITFIRE.Class(SPITFIRE.TransitionProperties);
//--------------------------------------
// SPITFIRE.FunctionTask
//--------------------------------------

SPITFIRE.FunctionTask = function(context, method) {
  this.callSuper();
  this.setQualifiedClassName('SPITFIRE.FunctionTask');
  this.setMethod(method);
  this.setContext(context);
  this.setArgs([]);
  var i, len;
  for (i = 2, len = arguments.length; i < len; i += 1) {
  	this.getArgs().push(arguments[i]);
  }
};

SPITFIRE.FunctionTask.superclass = SPITFIRE.Task;
SPITFIRE.FunctionTask.synthesizedProperties = ['context', 'method', 'args'];

SPITFIRE.FunctionTask.prototype = {
  //--------------------------------------
  // Methods
  //--------------------------------------
  
  start: function() {
    this.getMethod().apply(this.getContext(), this.getArgs());
    this.complete();
  },

  toString: function() {
    return '[' + this.getQualifiedClassName() + '] function:' + this.getMethod()._name;
  }
};

SPITFIRE.Class(SPITFIRE.FunctionTask);
//--------------------------------------
// SPITFIRE.JQueryAjaxTask
//--------------------------------------

SPITFIRE.JQueryAjaxTask = function(url, settings) {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.JQueryAjaxTask');
  this.url(url);
  this.settings(settings);
};

SPITFIRE.JQueryAjaxTask.superclass = SPITFIRE.Task;
SPITFIRE.JQueryAjaxTask.synthesizedProperties = ['url', 'settings', 'content'];

SPITFIRE.JQueryAjaxTask.prototype = {  
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
    return '[' + this.qualifiedClassName() + '] url:' + this.url();
  }
};

SPITFIRE.Class(SPITFIRE.JQueryAjaxTask);
//--------------------------------------
// SPITFIRE.JQueryEffectTask
//--------------------------------------

SPITFIRE.JQueryEffectTask = function(target, effect) {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.JQueryEffectTask');
  
  var args = SPITFIRE.slice(arguments, 2, arguments.length - 1);
  
  if (!SPITFIRE.isFunction(target[effect])) {
    throw new SPITFIRE.Error('target does not support this effect');
  }
  
  this.target(target);
  this.effect(effect);
  this.args(args);
};

SPITFIRE.JQueryEffectTask.superclass = SPITFIRE.Task;
SPITFIRE.JQueryEffectTask.synthesizedProperties = ['target', 'effect', 'args'];

SPITFIRE.JQueryEffectTask.prototype = {

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

SPITFIRE.Class(SPITFIRE.JQueryEffectTask);
//--------------------------------------
// SPITFIRE.JQueryGetJSONTask
//--------------------------------------

SPITFIRE.JQueryGetJSONTask = function(url, data) {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.JQueryGetJSONTask');    
  this.url(url);
  this.data(data);
};

SPITFIRE.JQueryGetJSONTask.superclass = SPITFIRE.Task;
SPITFIRE.JQueryGetJSONTask.synthesizedProperties = ['url', 'data', 'content'];

SPITFIRE.JQueryGetJSONTask.prototype = {
  
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

SPITFIRE.Class(SPITFIRE.JQueryGetJSONTask);
//--------------------------------------
// SPITFIRE.JQueryImageLoaderTask
//--------------------------------------

SPITFIRE.JQueryImageLoaderTask = function(url) {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.JQueryImageLoaderTask');
  
  this.url(url);
  this.content(new Image());
  this.$content($(this.content()));
  
  this.$content()
    .load(this.completeHandler.context(this))
    .error(this.errorHandler.context(this));
};

SPITFIRE.JQueryImageLoaderTask.superclass = SPITFIRE.Task;
SPITFIRE.JQueryImageLoaderTask.synthesizedProperties = ['url', 'content', '$content'];

SPITFIRE.JQueryImageLoaderTask.prototype = {

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

SPITFIRE.Class(SPITFIRE.JQueryImageLoaderTask);
//--------------------------------------
// SPITFIRE.JQueryLoadTask
//--------------------------------------

SPITFIRE.JQueryLoadTask = function(url, $target) {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.JQueryLoadTask');
  
  if (!url) throw new SPITFIRE.Error('a valid url must be specified');
  
  this.url(url);
  this.$target($target || $('body'));
};

SPITFIRE.JQueryLoadTask.superclass = SPITFIRE.Task;
SPITFIRE.JQueryLoadTask.synthesizedProperties = ['url', '$target'];

SPITFIRE.JQueryLoadTask.prototype = {
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

SPITFIRE.Class(SPITFIRE.JQueryLoadTask);
//--------------------------------------
// SPITFIRE.ParallelTask
//--------------------------------------

SPITFIRE.ParallelTask = function() {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.ParallelTask');
  
  if (arguments.length > 0) {
    this.tasks(arguments);
  }
};

SPITFIRE.ParallelTask.superclass = SPITFIRE.TaskManager;

SPITFIRE.ParallelTask.prototype = {
  //--------------------------------------
  // Event Handlers
  //--------------------------------------
  
  taskCompleteHandler: function(event) {
    var task = event.target();
		if (this.debug()) {
			log("taskComplete " + task);
		}
		task.unbind(SPITFIRE.Event.COMPLETE, this.taskCompleteHandler.context(this));
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
        	task.bind(SPITFIRE.Event.COMPLETE, this.taskCompleteHandler.context(this));
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

SPITFIRE.Class(SPITFIRE.ParallelTask);
//--------------------------------------
// SPITFIRE.PropertyTask
//--------------------------------------

SPITFIRE.PropertyTask = function(target, property, value) {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.PropertyTask');
  this.target(target);
  this.property(property);
  this.value(value);
};

SPITFIRE.PropertyTask.superclass = SPITFIRE.Task;
SPITFIRE.PropertyTask.synthesizedProperties = ['target', 'property', 'value'];

SPITFIRE.PropertyTask.prototype = {
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

SPITFIRE.Class(SPITFIRE.PropertyTask);
//--------------------------------------
// SPITFIRE.SequentialTask
//--------------------------------------

SPITFIRE.SequentialTask = function() {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.SequentialTask');
  
  if (arguments.length > 0) {
    this.tasks(arguments);
  }
};

SPITFIRE.SequentialTask.superclass = SPITFIRE.TaskManager;
SPITFIRE.SequentialTask.synthesizedProperties = [];

SPITFIRE.SequentialTask.prototype = {

  //--------------------------------------
  // Event Handlers
  //--------------------------------------
  
  taskCompleteHandler: function(event) {
    var task = event.target();
		if (this.debug()) {
			log("taskComplete " + task);
		}
		task.unbind(SPITFIRE.Event.COMPLETE, this.taskCompleteHandler.context(this));
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
		task.bind(SPITFIRE.Event.COMPLETE, this.taskCompleteHandler.context(this));
		if (this.debug()) {
			log("taskStart " + task);
		}
		task.start();
  },

  toString: function() {
    return '[' + this.qualifiedClassName() + ' name=' + this.name() +']';
  }
};

SPITFIRE.Class(SPITFIRE.SequentialTask);
//--------------------------------------
// SPITFIRE.UIButton
//--------------------------------------

SPITFIRE.UIButton = function() {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.UIButton');
};

SPITFIRE.UIButton.superclass = SPITFIRE.DisplayObject;
SPITFIRE.UIButton.synthesizedProperties = [];

SPITFIRE.UIButton.prototype = {
  
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
    SPITFIRE.addListener(this, 'click', 'clickHandler');
    SPITFIRE.addListener(this, 'mouseover', 'mouseOverHandler');
    SPITFIRE.addListener(this, 'mouseout', 'mouseOutHandler');
    SPITFIRE.addListener(this, 'mouseup', 'mouseUpHandler');
    SPITFIRE.addListener(this, 'mousedown', 'mouseDownHandler');
  },
  
  toString: function() {
    return '[' + this.qualifiedClassName() + ']';
  }
};

SPITFIRE.Class(SPITFIRE.UIButton);
//--------------------------------------
// SPITFIRE.UICarousel
//--------------------------------------

SPITFIRE.UICarousel = function(config) {
  config.name = config.name || 'carousel';
  this.config = config;
  
  this.callSuper(config.name);
  this.qualifiedClassName('SPITFIRE.UICarousel');
  
  this.data = config.data || [];
  this._items = [];
  this._itemWidth = config.itemWidth || 270;
  this._itemHeight = config.itemHeight || 180;
  this._neighbors = config.neighbors || 2;
  this._itemDistance = config.itemDistance || 160;
  this._speed = config.speed || 500;
  this._scaleRatio = config.scaleRatio || 0.3;
  this._positionIndex = 0;
  
  // DOM elements
  this.$carouselContainer = (typeof config.carouselContainer !== 'undefined') ? $('#' + config.carouselContainer) : undefined;
  this.hasDescriptionContainer = typeof config.descriptionContainer !== 'undefined';
  this.$descriptionContainer = (this.hasDescriptionContainer) ? $('#' + config.descriptionContainer) : undefined;
  this.$previousButton = (typeof config.previousButton !== 'undefined') ? $('#' + config.previousButton) : undefined;
  this.$nextButton = (typeof config.nextButton !== 'undefined') ? $('#' + config.nextButton) : undefined;
  
  // set center point
  this.center(new SPITFIRE.Point(~~(this.$carouselContainer.width() * 0.5), ~~(this.$carouselContainer.height() * 0.5)));
  
  this.initStates();
  this.initHandlers();
};

SPITFIRE.UICarousel.superclass = SPITFIRE.State;
SPITFIRE.UICarousel.synthesizedProperties = [
  'items',
  'center',
  'itemHeight',
  'itemWidth',
  'neighbors',
  'itemDistance',
  'positionIndex',
  'startX',
  'centerIndex',
  'speed',
  'scaleRatio'
];

SPITFIRE.UICarousel.prototype = {

  //--------------------------------------
  // Getters / Setters
  //--------------------------------------
  
  setPositionIndex: function(value) {  
/*     if (this._positionIndex == value) return; */
    var oldPositionIndex = this._positionIndex;
    
    var delta = this.items()[oldPositionIndex].carouselIndex() - this.items()[value].carouselIndex();
    var i, len, item, newIndex, newPos, indexFromCenter, opacity, scale, z,
        half = (this.items().length * 0.5 >> 0) + 1; 
    
    for (i = 0, len = this.items().length; i < len; i += 1) {
      item = this.items()[i];
      
      // assign new carousel index to item
      newIndex = item.carouselIndex() + delta;
      newIndex = (newIndex < 0 || newIndex >= len) ? (newIndex < 0) ? newIndex + len : newIndex - len : newIndex;
      item.carouselIndex(newIndex);
      item.carousel(this);
      newPos = item.carouselIndex() * this.itemDistance() + this.startX();
      
      // adjust z-index 
      indexFromCenter = Math.abs(this.centerIndex() - newIndex);
      z = (half - indexFromCenter) * 25;
      //item.$this().css('z-index', len - indexFromCenter);
      
      // opacity
      opacity = (indexFromCenter <= this.neighbors()) ? 1 : 0;
      
      // scale
      scale = 1 - indexFromCenter * this.scaleRatio();
      
      // animate
      item.animate(newPos, this.center().y, z, scale, opacity, this._speed * Math.abs(delta));
    }
    
    this._positionIndex = value;
    
    this.trigger(new SPITFIRE.Event(SPITFIRE.Event.CHANGE));
  },
  
  //--------------------------------------
  // Event Handlers
  //--------------------------------------
  
  childChangeHandler: function(event) {
    this.callSuper(event);
    
    this.updateDescription();
  },
  
  imagesLoadedHandler: function(event) {
    this.positionItems();
    this.getChildByName(this.getDefaultChild()).browse();
  },

  //--------------------------------------
  // Methods
  //--------------------------------------
  
  initStates: function() {

    var sequentialTask = new SPITFIRE.SequentialTask();
    sequentialTask.bind(SPITFIRE.Event.COMPLETE, this.imagesLoadedHandler.context(this));
    
    var i, len, data, uid, state, item, $el;
    for (i = 0, len = this.data.length; i < len; i += 1) {
      data = this.data[i];
      uid = 'item' + (i + 1);
      
      state = new SPITFIRE.UICarouselItem(uid, data.imageUrl, i);
      this.$carouselContainer.append(state.$el);
      
      sequentialTask.addTask(state.loader);
      sequentialTask.addTask(new SPITFIRE.FunctionTask(this, this.initImage, state));

      this.addChild(state);
      this._items.push(state);
    }
    
    sequentialTask.start();
    
    if (this.data.length) {
      this.defaultChild(this.getChildren()[this._positionIndex].getName());
    }
  },
  
  initImage: function(state) {
    state.setItemDimensions(this._itemWidth, this._itemHeight);
  },
  
  initHandlers: function() {
    if (typeof this.$previousButton !== 'undefined') this.$previousButton.bind('click', $.proxy(this.previous, this));
    if (typeof this.$nextButton !== 'undefined') this.$nextButton.bind('click', $.proxy(this.next, this));
  },
  
  updateDescription: function() {
    if (!this.hasDescriptionContainer) return;
    
    var desc = this.data[this.getPositionIndex()].description;
    desc = (typeof desc != 'undefined') ? desc : '';

    this.$descriptionContainer.html(desc);
  },
  
  positionItems: function() {
    var rightIndex = this._positionIndex + 1,
        leftIndex = (this._positionIndex - 1 >= 0) ? this._positionIndex - 1 : this._items.length - 1,
        startLeft = leftIndex,
        startRight = rightIndex,
        xPos = this.getCenter().x,
        yPos = this.getCenter().y,
        centerItem = this.items()[this._positionIndex],
        rightXPos = xPos + this.itemDistance(),
        leftXPos = xPos - this.itemDistance(),
        rightItem, leftItem,
        count = 0,
        halfNumItems = Math.ceil((this._items.length - 1) * 0.5),
        opacity;
        
    this.centerIndex(Math.floor(this._items.length * 0.5));
    
    centerItem.displayObject.l(xPos);
    centerItem.displayObject.t(yPos);
    centerItem.$el.css('opacity', 1);
    centerItem.carouselIndex(this.centerIndex());

    while (count < halfNumItems) {
/*       log('left: ' + leftIndex + ' right: ' + rightIndex); */
      count++;
      opacity = (count > this.neighbors()) ? 0 : 1;
      rightItem = this._items[rightIndex];
      
      if (rightItem) {
        rightItem.displayObject.l(rightXPos);
        rightItem.displayObject.t(yPos);
        rightItem.carouselIndex(this.centerIndex() + count);
        rightItem.$el.css('opacity', opacity);
        rightXPos += this.itemDistance();
        rightIndex++;
        
        if (rightIndex >= this._items.length)
          rightIndex = 0;
      }
      
      leftItem = this._items[leftIndex];
      if (leftItem) {
        leftItem.displayObject.l(leftXPos);
        leftItem.displayObject.t(yPos);
        leftItem.carouselIndex(this.centerIndex() - count);
        leftItem.$el.css('opacity', opacity);
        
        leftXPos -= this.itemDistance();
        leftIndex--;
        
        if (leftIndex < 0)
          leftIndex = this._items.length - 1;
      }
    }
    
    this.startX(leftItem.displayObject.l());
  },
  
  previous: function() {
    var nextIndex = this._positionIndex - 1;
    nextIndex = (nextIndex < 0) ? this._items.length - 1 : nextIndex;
    this._items[nextIndex].browse();
  },
  
  next: function() {
    var nextIndex = this._positionIndex + 1;
    nextIndex = (nextIndex >= this._items.length) ? 0 : nextIndex;
    this._items[nextIndex].browse();
  }
};

SPITFIRE.Class(SPITFIRE.UICarousel);
//--------------------------------------
// SPITFIRE.UICarouselItem
//--------------------------------------

SPITFIRE.UICarouselItem = function(name, url, index) {
  this.callSuper(name);
  this.qualifiedClassName('SPITFIRE.UICarouselItem');
  this._itemHeight = 100;
  this._scale = 1;
  this._itemIndex = index;
  this.loader = new SPITFIRE.JQueryImageLoaderTask(url);
  this.$img = this.loader.get$content();
  
  // create container
  var el = document.createElement('div');
  el.className = 'carouselItemContainer';
  this.$el = $(el);
  this.$el.append(this.$img);
  this.$el.css('opacity', 0);
  this.displayObject = new SPITFIRE.DisplayObject(this.$el);
  this.imgDisplayObject = new SPITFIRE.DisplayObject(this.$img);
  this.imgDisplayObject.setIsCentered(true);
};

SPITFIRE.UICarouselItem.superclass = SPITFIRE.State;
SPITFIRE.UICarouselItem.synthesizedProperties = [
  'itemIndex',
  'carouselIndex',
  'carousel',
  'img',
  'itemHeight',
  'itemWidth'
];

SPITFIRE.UICarouselItem.prototype = {

  //--------------------------------------
  // Getters / Setters
  //--------------------------------------
  
  getTransitionIn: function() {
    return new SPITFIRE.FunctionTask(this, this.transitionIn);
  },
  
  //--------------------------------------
  // Event Handlers
  //--------------------------------------
  
  clickHandler: function(event) {
    this.getParent().setPositionIndex(this.getItemIndex());
  },

  //--------------------------------------
  // Methods
  //--------------------------------------
  
  transitionIn: function() {
    this.getParent().setPositionIndex(this.getItemIndex());
  },

  setItemDimensions: function(width, height) {
    this.setItemWidth(width);
    this.setItemHeight(height);
    /*
    var rect = new SPITFIRE.Rectangle(0, 0, this._itemWidth, this._itemHeight);
    var newRect = SPITFIRE.RatioUtils.scaleWidth(rect, this._itemHeight, true);
    */
    this.imgDisplayObject.setW(this._itemWidth);
    this.imgDisplayObject.setH(this._itemHeight);
    this.imgDisplayObject.scale(this._scale);
  },
  
  animate: function(x, y, z, scale, opacity, duration) {
    this.$el.css('opacity', 1);
    this.displayObject.animate({
      l: x,
      t: y,
      z: z,
      opacity: opacity
    }, {
      duration: duration
    });
    
    this.imgDisplayObject.animate({
      scale: scale
    }, {
      duration: duration
    });
  }
};

SPITFIRE.Class(SPITFIRE.UICarouselItem);
//--------------------------------------
// SPITFIRE.UISlideshow
//--------------------------------------

SPITFIRE.UISlideshow = function(config) {
  config.name = config.name || 'slideshow';
  this.config = config;
  
  this.callSuper(config.name);
  this.setQualifiedClassName('SPITFIRE.UISlideshow');
  
  // validate configuration
  if (typeof config === 'undefined' ||
      typeof config.imageContainer === 'undefined') {
    throw new SPITFIRE.Error(this.toString() + ' is misconfigured');    
  }
  
  this.data = config.data || [];
  this.$imageContainer = $('#' + config.imageContainer);
  this._currentIndex = 0;
  
  this.hasDescriptionContainer = typeof config.descriptionContainer !== 'undefined';
  this.$descriptionContainer = (this.hasDescriptionContainer) ? $('#' + config.descriptionContainer) : undefined;
  this.$previousButton = (typeof config.previousButton !== 'undefined') ? $('#' + config.previousButton) : undefined;
  this.$nextButton = (typeof config.nextButton !== 'undefined') ? $('#' + config.nextButton) : undefined;
  this.$previousPageButton = (typeof config.previousPageButton !== 'undefined') ? $('#' + config.previousPageButton) : undefined;
  this.$nextPageButton = (typeof config.nextPageButton !== 'undefined') ? $('#' + config.nextPageButton) : undefined;
  
  this.hasLoadingIndicator = (typeof config.loadingIndicator !== 'undefined');
  this.$loadingIndicator = (this.hasLoadingIndicator) ? $('#' + config.loadingIndicator) : undefined;
  if (this.hasLoadingIndicator) this.$loadingIndicator.hide();
  
  this.hasDrawer = (typeof config.drawer !== 'undefined');
  this.$drawer = (this.hasDrawer) ? $('#' + config.drawer) : undefined;
  
  this.initStates();
  this.initDrawer();
  this.initHandlers();
};

SPITFIRE.UISlideshow.superclass = SPITFIRE.State;
SPITFIRE.UISlideshow.synthesizedProperties = [
  'currentIndex',
  'currentPageIndex'
];

SPITFIRE.UISlideshow.prototype = {

  //--------------------------------------
  // Getters / Setters
  //--------------------------------------
  
  setCurrentIndex: function(value) {
    this._currentIndex = value;
    this.states[this._currentIndex].browse();
  },
  
  setCurrentPageIndex: function(value) {
    if (this._currentPageIndex === value) return;
    this._currentPageIndex = value;
    
    // move to current page
    var xPos = -1 * this._currentPageIndex * (this._drawerThumbWidth + this._drawerGutter) * this._drawerThumbsPerPage;
    
    this.$drawer.animate({left: xPos}, {duration: 600, queue: false});
  },

  //--------------------------------------
  // Event Handlers
  //--------------------------------------
  
  childChangeHandler: function(event) {
    this.callSuper(event);
    
    this.updateDrawer();
    this.updateDescription();
  },
  
  thumbsLoadedHandler: function(event) {
    
  },
  
  thumbClickHandler: function(event) {
    this.setCurrentIndex(event.currentTarget.index);
  },

  //--------------------------------------
  // Methods
  //--------------------------------------
  
  initStates: function() {
    this.states = [];
    
    var i, len, item, uid, state;
    for (i = 0, len = this.data.length; i < len; i += 1) {
      item = this.data[i];
      uid = 'image' + (i + 1);
      
      state = new SPITFIRE.UISlideshowItem(uid, item.imageUrl);
      
      // add image to container
      this.$imageContainer.append(state.loader.get$content());
      
      this.addChild(state);
      this.states.push(state);
    }
    
    if (this.data.length) {
      this.defaultChild(this.getChildren()[this._currentIndex].getName());
    }
  },
  
  initDrawer: function() {
    if (!this.hasDrawer) return;
    
    this._drawerItemX = 0;
    this._drawerThumbsPerPage = this.config.drawerThumbsPerPage || 10;
    this._drawerGutter = this.config.drawerGutter || 0;
    this._drawerThumbWidth = this.config.drawerThumbWidth || 100;
    this._$thumbs = [];
    this._numPages = Math.ceil(this.data.length / this._drawerThumbsPerPage);
    var sequentialTask = new SPITFIRE.SequentialTask();
    sequentialTask.bind(SPITFIRE.Event.COMPLETE, this.thumbsLoadedHandler.context(this));
    
    // load thumbnails and add them to drawer
    var i, len, item, thumb, $el;
    for (i = 0, len = this.data.length; i < len; i += 1) {
      item = this.data[i];
      thumb = new SPITFIRE.JQueryImageLoaderTask(item.thumbnailUrl);
      $el = $('<div class="slideshowThumbContainer"></div>');
      $el.append(thumb.get$content());
      $el.hide();
      $el[0].index = i;
      $el.bind('click', $.proxy(this.thumbClickHandler, this));
      this.$drawer.append($el);
      this._$thumbs.push($el);
      sequentialTask.addTask(thumb);
      sequentialTask.addTask(new SPITFIRE.FunctionTask(this, this.positionThumb, $el));
    }
    
    sequentialTask.start();
  },
  
  initHandlers: function() {
    if (typeof this.$previousButton !== 'undefined') this.$previousButton.bind('click', $.proxy(this.previousImage, this));
    if (typeof this.$nextButton !== 'undefined') this.$nextButton.bind('click', $.proxy(this.nextImage, this));
    if (typeof this.$previousPageButton !== 'undefined') this.$previousPageButton.bind('click', $.proxy(this.previousPage, this));
    if (typeof this.$nextPageButton !== 'undefined') this.$nextPageButton.bind('click', $.proxy(this.nextPage, this));
  },
  
  positionThumb: function($el) {
    $el.css('left', this._drawerItemX);
    this._drawerItemX += this._drawerThumbWidth + this._drawerGutter;
    $el.show();
  },
  
  previousImage: function() {
    var currIndex = this.getCurrentIndex();
    currIndex--;
    currIndex = (currIndex < 0) ? this.states.length - 1 : currIndex;
    
    this.setCurrentIndex(currIndex);
  },
  
  nextImage: function() {
    var currIndex = this.getCurrentIndex();
    currIndex++;
    currIndex = (currIndex >= this.states.length) ? 0 : currIndex;
    
    this.setCurrentIndex(currIndex);
  },
  
  previousPage: function() {
    var currPageIndex = this.getCurrentPageIndex();
    currPageIndex--;
    currPageIndex = (currPageIndex < 0) ? this._numPages - 1 : currPageIndex;
    this.setCurrentPageIndex(currPageIndex);
  },
  
  nextPage: function() {
    var currPageIndex = this.getCurrentPageIndex();
    currPageIndex++;
    currPageIndex = (currPageIndex >= this._numPages) ? 0 : currPageIndex;
    
    this.setCurrentPageIndex(currPageIndex);
  },
  
  updateDrawer: function() {
    if (!this.hasDrawer) return;
  
    var i, len, $thumb;
    for (i = 0, len = this._$thumbs.length; i < len; i += 1) {
      var $thumb = this._$thumbs[i];
      
      if (i === this.getCurrentIndex()) {
        $thumb.addClass('selected');
      } else {
        $thumb.removeClass('selected');
      }
    }
    
    // set the correct page
    var pageIndex = ~~ (this.getCurrentIndex() / this._drawerThumbsPerPage);
    this.setCurrentPageIndex(pageIndex);
  },
  
  updateDescription: function() {
    if (!this.hasDescriptionContainer) return;
    
    var desc = this.data[this.getCurrentIndex()].description;
    desc = (typeof desc != 'undefined') ? desc : '';

    this.$descriptionContainer.html(desc);
  }
};

SPITFIRE.Class(SPITFIRE.UISlideshow);
//--------------------------------------
// SPITFIRE.UISlideshowItem
//--------------------------------------

SPITFIRE.UISlideshowItem = function(name, url) {
  this.callSuper(name);
  this.setQualifiedClassName('SPITFIRE.UISlideshowItem');
  
  this.url = url;
  this.loader = new SPITFIRE.JQueryImageLoaderTask(this.url);
  this.loader.get$content().hide();
};

SPITFIRE.UISlideshowItem.superclass = SPITFIRE.State;
SPITFIRE.UISlideshowItem.synthesizedProperties = [];

SPITFIRE.UISlideshowItem.prototype = {

  //--------------------------------------
  // Getters / Setters
  //--------------------------------------

  getLoadIn: function() {
    return new SPITFIRE.FunctionTask(this, this.loadImage);
  },
  
  getTransitionIn: function() {
    return new SPITFIRE.FunctionTask(this, this.transitionIn);
  },
  
  getTransitionOut: function() {
    return new SPITFIRE.FunctionTask(this, this.transitionOut);
  },
  
  //--------------------------------------
  // Methods
  //--------------------------------------
  
  loadImage: function() {
    this.loader.start();
  },
  
  transitionIn: function() {
    this.loader.get$content().fadeIn();
  },
  
  transitionOut: function() {
    this.loader.get$content().fadeOut();
  }
};

SPITFIRE.Class(SPITFIRE.UISlideshowItem);
SPITFIRE.ArrayUtils = {};

//--------------------------------------
// getItemByKeys()
//--------------------------------------
// Port of org.casalib.util.ArrayUtil.getItemByKeys() from CASA lib for ActionScript 3.0
// http://casalib.org/

SPITFIRE.ArrayUtils.getItemByKeys = function(inArray, keyValues) {
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

SPITFIRE.ArrayUtils.getItemsByKeys = function(inArray, keyValues) {
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

SPITFIRE.ArrayUtils.getItemByAnyKey = function(inArray, keyValues) {
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

SPITFIRE.ArrayUtils.getItemsByAnyKey = function(inArray, keyValues) {
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

SPITFIRE.ArrayUtils.getItemByKey = function(inArray, key, match) {
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

SPITFIRE.ArrayUtils.getItemsByKey = function(inArray, key, match) {
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

SPITFIRE.ArrayUtils.hasValue = function(inArray, value) {
  var i, len;
  for (i = 0, len = inArray.length; i < len; i += 1) {
  	if (inArray[i] === value) return true;
  }
  
  return false;
}
SPITFIRE.ObjectUtils = {};

//--------------------------------------
// getItemByKeys()
//--------------------------------------
// Port of org.casalib.util.ArrayUtil.getItemByKeys() from CASA lib for ActionScript 3.0
// http://casalib.org/

SPITFIRE.ObjectUtils.getKeyByValue = function(inObject, value) {
  for (var key in inObject) {
    if (inObject[key] === value) {
      return key;
    }
  }
  
  return undefined;
};
// Ported to JS from CasaLib AS3
// http://casalib.org/
SPITFIRE.RatioUtils = SPITFIRE.RatioUtils || {
  widthToHeight: function(size) {
    return size.width() / size.height();
  },
  
  heightToWidth: function(size) {
    return size.height() / size.width();
  },
  
  scale: function(size, amount, snapToPixel) {
    snapToPixel = snapToPixel || true;
    return SPITFIRE.RatioUtils._defineRect(size, size.width() * amount.decimalPercentage(), size.height() * amount.decimalPercentage(), snapToPixel);
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
    return SPITFIRE.RatioUtils._defineRect(size, height * SPITFIRE.RatioUtils.widthToHeight(size), height, snapToPixel);
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
    return SPITFIRE.RatioUtils._defineRect(size, width, width * SPITFIRE.RatioUtils.heightToWidth(size), snapToPixel);
  },
  
  scaleToFill: function(size, bounds, snapToPixel) {
    snapToPixel = snapToPixel || true;
    var scaled = SPITFIRE.RatioUtils.scaleHeight(size, bounds.width(), snapToPixel);
		
		if (scaled.height() < bounds.height())
			scaled = SPITFIRE.RatioUtils.scaleWidth(size, bounds.height(), snapToPixel);
		
		return scaled;
  },
  
  scaleToFit: function(size, bounds, snapToPixel) {
    snapToPixel = snapToPixel || true;
    var scaled = SPITFIRE.RatioUtils.scaleHeight(size, bounds.width(), snapToPixel);
		
		if (scaled.height() > bounds.height())
			scaled = SPITFIRE.RatioUtils.scaleWidth(size, bounds.height(), snapToPixel);
		
		return scaled;
  },
  
  _defineRect: function(size, width, height, snapToPixel) {
    var scaled = size.clone();
    scaled.width(snapToPixel ? ~~(width) : width);
    scaled.height(snapToPixel ? ~~(height) : height);
    
    return scaled;
  }
};
//--------------------------------------
// Timer
//--------------------------------------

SPITFIRE.Timer = function(delay, repeatCount) {
  this.callSuper();
  this.delay(delay);
  this.repeatCount(repeatCount || 0);
  this.qualifiedClassName('SPITFIRE.Timer');
  this._interval;
  this._currentCount = 0;
};

SPITFIRE.Timer.superclass = SPITFIRE.EventDispatcher;
SPITFIRE.Timer.synthesizedProperties = [
  'currentCount',
  'delay',
  'repeatCount',
  'running'
];

SPITFIRE.Timer.prototype = {
  setRunning: function(value) {
    throw new SPITFIRE.Error('running is read-only');
  },
  
  setCurrentCount: function(value) {
    throw new SPITFIRE.Error('currentCount is read-only');
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
      clearTimeout(this._interval);
    }
    
    this._interval = undefined;
  },
  
  tick: function() {
    this._currentCount += 1;
    if (this.repeatCount() && this._currentCount >= this.repeatCount()) {
      this.trigger(new SPITFIRE.TimerEvent(SPITFIRE.TimerEvent.TIMER_COMPLETE));
      this.reset();
      return;
    }
    
    this._interval = setTimeout(this.tick.context(this), this.delay());
    this.trigger(new SPITFIRE.TimerEvent(SPITFIRE.TimerEvent.TIMER));
  }
}

SPITFIRE.Class(SPITFIRE.Timer);
