SPITFIRE.events = SPITFIRE.events || {};

//--------------------------------------
// Event
//--------------------------------------

SPITFIRE.events.Event = function(type, data, bubbles, cancelable) {
  this.bubbles(bubbles || false);
  this.cancelable(cancelable || false);
  this.data(data || {});
  this.type(type);
};

SPITFIRE.events.Event.COMPLETE = 'complete';
SPITFIRE.events.Event.CHANGE = 'change';

SPITFIRE.events.Event.synthesizedProperties = ['bubbles', 'cancelable', 'data', 'target', 'type'];
SPITFIRE.events.Event.superclass = SPITFIRE.Object;
SPITFIRE.Class(SPITFIRE.events.Event);