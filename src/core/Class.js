/*global SPITFIRE*/

//--------------------------------------
// Class
//--------------------------------------

SPITFIRE.Class = function(classDefinition) {
  if (classDefinition.isExtended) {
    return;
  }
  
  var getterHelper, setterHelper, accessorMethodHelper, i, len, synProp, synPropMethodName, obj;
  
  // create synthesized properties
  if (typeof classDefinition.synthesizedProperties !== 'undefined') {
    
    // helper function to bind the accessor method to the correct property name
    getterHelper = function(propertyName) {
      return function() {
        return this['_' + propertyName];
      };
    };
    
    setterHelper = function(propertyName) {
      return function(value) {
        this['_' + propertyName] = value;
        return this;
      };
    };
    
    accessorMethodHelper = function(propName) {
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
    
    for (i = 0, len = classDefinition.synthesizedProperties.length; i < len; i += 1) {
      synProp = classDefinition.synthesizedProperties[i];
      synPropMethodName = synProp.charAt(0).toUpperCase() + synProp.slice(1);
      
      // create getter / setter methods
      if (!('get' + synPropMethodName in classDefinition.prototype)) {
        classDefinition.prototype['get' + synPropMethodName] = getterHelper(synProp);
      }
      
      if (!('set' + synPropMethodName in classDefinition.prototype)) {
        classDefinition.prototype['set' + synPropMethodName] = setterHelper(synProp);
      }
        
      classDefinition.prototype[synProp] = accessorMethodHelper(synPropMethodName);
    }
  }
  
  // traverse inheritance chain, begin with first
  // parent and apply prototypes and properties to
  // a singular object, inserting function statements
  // when callSuper is called
  
  obj = {};
  
  function merge(classDef, supr) {
    var temp, key,
        pattern = /callSuper/ig;
    if (typeof classDef !== 'undefined') {
      temp = SPITFIRE.clone(classDef);
      
      for (key in supr) {
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
  
  function extend(supr, classDef) {
    classDef.prototype = merge(classDef.prototype, supr.prototype);
    
    return classDef;
  }
  
  (function (classDef) {
    var parent = classDefinition.superclass;
    if (parent) {
      // check for superclass
      if (parent.superclass && !parent.isExtended) {
        arguments.callee(parent.superclass);  // recursively call the annonymous function
      }
      
      obj = extend(parent, obj);
    }
  }(classDefinition));
  
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
};