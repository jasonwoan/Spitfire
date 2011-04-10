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