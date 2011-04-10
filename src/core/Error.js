//--------------------------------------
// Error
//--------------------------------------

SPITFIRE.Error = function(message) {
  this.callSuper();
  this.message(message);
  this.name('Error');
  this.qualifiedClassName('SPITFIRE.Error');
};

SPITFIRE.Error.superclass = SPITFIRE.Object;
SPITFIRE.Error.synthesizedProperties = ['message', 'name'];

SPITFIRE.Error.prototype = {
  toString: function() {
    return this.name() + ': [' + this.qualifiedClassName() + '] "' + this.message() + '"';
  }
}

SPITFIRE.Class(SPITFIRE.Error);
