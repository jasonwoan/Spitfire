var Warthog = {};

Warthog.Class = function(classDefinition) {
  // create synthesized properties
  if (typeof classDefinition.synthesizedProperties !== 'undefined') {
    var i, len;
    for (i = 0, len = classDefinition.synthesizedProperties.length; i < len; i += 1) {
      var synProp = classDefinition.synthesizedProperties[i];
      var synPropMethodName = synProp.charAt(0).toUpperCase() + synProp.slice(1);
      
      // create getter / setter methods
      classDefinition.prototype['get' + synPropMethodName] = function() {
        return this['_' + synProp];
      };
      
      classDefinition.prototype['set' + synPropMethodName] = function(value) {
        this['_' + synProp] = value;
      };
      
      // create singular getter/setter method
      classDefinition.prototype[synProp] = function() {
        if (arguments.length) {
          // setter
          this['set' + synPropMethodName].apply(this, arguments);
        } else {
          // getter
          return this['get' + synPropMethodName].apply(this, arguments);
        }
      };
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