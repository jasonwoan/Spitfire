//--------------------------------------
// Error
//--------------------------------------

SPITFIRE.Error = function(message) {
  this.callSuper();
  this.setMessage(message);
  this.setName('Error');
  this.setQualifiedClassName('SPITFIRE.Error');
};

SPITFIRE.Error.superclass = SPITFIRE.Object;
SPITFIRE.Error.synthesizedProperties = ['message', 'name'];

SPITFIRE.Error.prototype = {
  toString: function() {
    return this.getName() + ': [' + this.getQualifiedClassName() + '] "' + this.getMessage() + '"';
  }
}

SPITFIRE.Class(SPITFIRE.Error);
