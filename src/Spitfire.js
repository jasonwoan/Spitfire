var SPITFIRE = SPITFIRE || {};

var $s = $s || SPITFIRE;

// Allows for binding context to functions
// when using in event listeners and timeouts
Function.prototype.context = function(obj) {
  var method = this;
  temp = function() {
    return method.apply(obj, arguments);
  };
  return temp;
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

SPITFIRE.isArray = function(obj) {
  return typeof obj === 'object' && obj.length;
};

SPITFIRE.isFunction = function(obj) {
  return typeof obj === 'function';
};

//  Credit: jQuery
//  A crude way of determining if an object is a window
SPITFIRE.isWindow = function(obj) {
		return obj && typeof obj === "object" && "setInterval" in obj;
};

//  Credit: jQuery
SPITFIRE.isPlainObject = function(obj) {
	// Must be an Object.
	// Because of IE, we also have to check the presence of the constructor property.
	// Make sure that DOM nodes and window objects don't pass through, as well
	if (!obj || typeof obj !== "object" || obj.nodeType || SPITFIRE.isWindow(obj)) {
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

SPITFIRE.objectHasMethod = function (obj, method) {
    return obj !== null && obj[method] !== undefined && SPITFIRE.isFunction(obj[method]);
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
				// }
			}
		}
	}

	// Return the modified object
	return target;
};
