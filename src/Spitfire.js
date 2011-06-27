/*global window, $*/
//"use strict";

var SPITFIRE = SPITFIRE || {};

var $s = $s || SPITFIRE;

SPITFIRE.browser = {};
SPITFIRE.browser.Opera = window.opera ? true : false;
SPITFIRE.browser.IE = document.all && !SPITFIRE.browser.Opera ? true : false;
SPITFIRE.browser.IE6 = SPITFIRE.browser.IE && typeof(window.XMLHttpRequest) === "undefined" ? true : false;
SPITFIRE.browser.IE8 = SPITFIRE.browser.IE && typeof(document.querySelectorAll) !== "undefined" ? true : false;
SPITFIRE.browser.IE7 = SPITFIRE.browser.IE && ! SPITFIRE.browser.IE6 && !SPITFIRE.browser.IE8 ? true : false;
SPITFIRE.browser.WebKit = /WebKit/i.test(navigator.userAgent) ? true : false;
SPITFIRE.browser.iPhone = /iPhone|iPod/i.test(navigator.userAgent) ? true : false;
SPITFIRE.browser.Chrome = /Chrome/i.test(navigator.userAgent) ? true : false;
SPITFIRE.browser.Safari = /Safari/i.test(navigator.userAgent) && !SPITFIRE.browser.Chrome ? true : false;
SPITFIRE.browser.Konqueror = navigator.vendor === "KDE" ? true : false;
SPITFIRE.browser.Konqueror4 = SPITFIRE.browser.Konqueror && /native code/.test(document.getElementsByClassName) ? true : false;
SPITFIRE.browser.Gecko = !SPITFIRE.browser.WebKit && navigator.product === "Gecko" ? true : false;
SPITFIRE.browser.Gecko19 = SPITFIRE.browser.Gecko && Array.reduce ? true : false;

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
	
	var hasOwn = Object.prototype.hasOwnProperty,
			key;

	// Not own constructor property must be Object
	if (obj.constructor &&
		!hasOwn.call(obj, "constructor") &&
		!hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
		return false;
	}
	
	return typeof key === 'undefined' || hasOwn.call(obj, key);
};

SPITFIRE.isSynthesizedProperty = function(property, classDefinition) {
  var arr = classDefinition.synthesizedProperties,
      isSynthesizedProperty = false,
			i, len;
  
  if (arr) {
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
		i -= 1;
	}

	for ( ; i < length; i += 1 ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) !== null ) {
			// Extend the base object
			for ( name in options ) {
				if (options.hasOwnProperty(name)) {
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
  if (typeof obj1 === 'undefined') {
		return SPITFIRE.clone(obj2);
	}
  if (typeof obj2 === 'undefined') {
		return SPITFIRE.clone(obj1);
	}
  
  var temp = SPITFIRE.clone(obj1),
			key;
  
  for (key in obj2) {
    // check to see if key already exists
    if (typeof temp[key] !== 'undefined') {
      // merge the two objects
      temp[key] = SPITFIRE.merge(temp[key], obj2[key]);
    } else {
      temp[key] = SPITFIRE.clone(obj2[key]);
    }
  }
  
  return temp;
};
  
SPITFIRE.clone = function(obj) {
  if (typeof obj !== 'object') {
		return obj;
	}
  
  var temp = {},
			key;
  
  for (key in obj) {
		if (obj.hasOwnProperty(key)) {
			temp[key] = SPITFIRE.clone(obj[key]);
			temp[key]._name = key;
		}
  }
  
  return temp;
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
  
  var self = $parent.filter('[sf-base]'),
			children = $parent.children(),
			i, len,
			el = self[0],
			basePath = el.getAttribute('sf-base'),
			nsObjects = basePath.split('.'),
			j, obj, len2, inst;
			
  for (i = 0, len = children.length; i < len; i += 1) {
    SPITFIRE.extendChildren($(children[i]));
  }
  
  if (self.length) {
    
    obj = window;
    
    for (j = 0, len2 = nsObjects.length; j < len2; j += 1) {
      obj = obj[nsObjects[j]];
    }
    
    if (!obj) {
      throw new SPITFIRE.Error('base class not found');
    }
    
    inst = new obj();
    
    SPITFIRE.extend(el, inst);
    el.init();
  }
};

// Tracking
SPITFIRE.trackEvent = function(category, action, label, value) {
  if (typeof category !== 'undefined' && typeof action !== 'undefined') {
    //log('[TRACKING EVENT // category:' + category + ' action:' + action + ' label:' + label + ' value:' + value + ']');
    _gaq.push(['_trackEvent', category, action, label, value]);
  }
};

SPITFIRE.trackPage = function(page) {
  if (typeof page !== 'undefined') {
    //log('[TRACKING PAGE // page:' + page + ']');
    _gaq.push(['_trackPageview', page]);
  }
};

SPITFIRE.bindAll = function(obj, methodNames) {
  for (var i = 0; i < methodNames.length; i++) {
    var methodName = methodNames[i];
    obj[methodName] = obj[methodName].context(obj);
  }
};