//--------------------------------------
// Class
//--------------------------------------
// Heavily inspired by Ben Nadel's "Implementing JavaScript Inheritance and Synthesized Properties"
// http://www.bennadel.com/blog/2040-Implementing-Javascript-Inheritance-And-Synthesized-Accessors-With-Annotation.htm

SPITFIRE.Class = function(classDefinition) {
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
    var parent = classDef.superclass;
    if (parent) {
      // check for superclass
      if (parent.superclass) {
        arguments.callee(parent.superclass);  // recursively call the annonymous function
      }
      
      obj = extend(parent, obj);
    }
  })(classDefinition);
  
  classDefinition = extend(obj, classDefinition);
  
  // add super powers
  classDefinition.prototype.callSuper = function() {
    var caller = arguments.callee.caller,
        methodName = caller._name,
        superMethod = caller._super;
    
    // check to see if caller is a constructor
    // if so call it's superclass    
    if (typeof caller.superclass !== 'undefined') {
      caller.superclass.apply(this, arguments);
    } else 
    
    // check to see if a super method is available
    if (typeof superMethod !== 'undefined') {
      superMethod.apply(this, arguments)
    }
  };
  
  function extend(supr, classDef) {
    classDef.prototype = merge(classDef.prototype, supr.prototype);
    
    return classDef;
  }
  
  function merge(obj1, obj2) {
    var temp;
    if (typeof obj1 !== 'undefined') {
      temp = clone(obj1);
      
      for (var key in obj2) {
        // check to see if method exists
        // if so save super method as a _super property
        // of the current method
        if (typeof temp[key] !== 'undefined') {
          temp[key]._super = obj2[key];
        } else {
          temp[key] = obj2[key];
        }
      }
    } else {
      temp = clone(obj2);
    }
    
    return temp;
  }
  
  function clone(obj) {
    if (typeof obj !== 'object') return obj;
    
    var temp = {};
    
    for (var key in obj) {
      temp[key] = clone(obj[key]);
      temp[key]._name = key;
    }
    
    return temp;
  }
};