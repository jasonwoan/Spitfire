//--------------------------------------
// Object
//--------------------------------------

SPITFIRE.Object = function() {
  this.qualifiedClassName('SPITFIRE.Object');
};

SPITFIRE.Object.synthesizedProperties = ['qualifiedClassName'];

SPITFIRE.Object.prototype = {
  init: function() {
  
  },
  
  callSuper: function() {
    var caller = SPITFIRE.Object.prototype.callSuper.caller;
    
    if (SPITFIRE.objectHasMethod(caller, 'superclass')) {
      // constructor super
      caller.superclass.apply(this, arguments);
    } else {
      // method super
      var proto = caller._class.superclass.prototype;
      var name = caller._name;
      
      if (SPITFIRE.objectHasMethod(proto, name)) {
        return proto[name].apply(this, arguments);
      }
    }
  }
}

SPITFIRE.Class(SPITFIRE.Object);