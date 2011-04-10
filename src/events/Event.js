//--------------------------------------
// Event
//--------------------------------------

SPITFIRE.Event = function(type, data, bubbles, cancelable) {
  this.bubbles(bubbles || false);
  this.cancelable(cancelable || false);
  this.data(data || {});
  this.type(type);
};

SPITFIRE.Event.COMPLETE = 'complete';

SPITFIRE.Event.synthesizedProperties = ['bubbles', 'cancelable', 'data', 'target', 'type'];
SPITFIRE.Event.superclass = SPITFIRE.Object;
SPITFIRE.Class(SPITFIRE.Event);