/*global window, log*/

// Allows for binding context to functions
// when using in event listeners and timeouts
Function.prototype.context = function(obj) {
  var method = this,
      temp;
  temp = function() {
    return method.apply(obj, arguments);
  };
  return temp;
};

// usage: log('inside coolFunc',this,arguments);
// http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if (typeof console !== 'undefined') {
    console.log( Array.prototype.slice.call(arguments) );
  }
};