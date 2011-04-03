//--------------------------------------
// Class
//--------------------------------------
// Heavily inspired by Ben Nadel's "Implementing JavaScript Inheritance and Synthesized Properties"
// http://www.bennadel.com/blog/2040-Implementing-Javascript-Inheritance-And-Synthesized-Accessors-With-Annotation.htm

SPITFIRE.Class = function(classDefinition) {
  var classMethods = {},
      i = 0,
      len,
      baseClass,
      getterName,
      setterName,
      propertyName,
      name,
      proto;
      
  // add meta to each method in class
  // this is used for callSuper method defined in SPITFIRE.Object
  proto = classDefinition.prototype;
  for (name in proto) {
    if (SPITFIRE.isFunction(proto[name])) {
      proto[name]._class = classDefinition;
      proto[name]._name = name;
    }
  }
  
  // check to see if class definition has a superclass
  if ('superclass' in classDefinition) {    
    baseClass = classDefinition.superclass;
    
    if (!baseClass.isInitialized) {
      SPITFIRE.Class(baseClass);
    }
    
    classMethods = SPITFIRE.extend(classMethods, baseClass.prototype);
  }
  
  // add the class's base methods to its prototype
  classMethods = SPITFIRE.extend(classMethods, classDefinition.prototype);
  
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
  
  // var defineGetterHelper = function(getterName) {
  //   return function() {
  //   return this[getterName]();
  //   };
  // };
  
  // var defineSetterHelper = function(setterName) {
  //   return function(value) {
  //     return this[setterName](value);
  //   };
  // };
  
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
    
    // __defineGetter & __defineSetter unsupported in < IE8
    // use a single accessor method for now until old versions of IE die
    // classMethods.__defineGetter__(propertyName, defineGetterHelper(getterName));
    // classMethods.__defineSetter__(propertyName, defineSetterHelper(setterName));
    
    classMethods[propertyName] = accessorMethodHelper(getterName, setterName);
  }
  
  classDefinition.prototype = classMethods;
  
  classDefinition.isInitialized = true;
};
