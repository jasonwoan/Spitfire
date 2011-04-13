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

SPITFIRE.addListener = function(target, event, handler, context) {
  context = context || target;
  
  if (SPITFIRE.browser.IE) {
    target.attachEvent('on' + event, context[handler].context(context));
  } else {
    target.addEventListener(event, context[handler].context(context), false);
  }
};

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