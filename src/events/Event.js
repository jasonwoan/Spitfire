/*global SPITFIRE*/

//--------------------------------------
// Event
//--------------------------------------

SPITFIRE.Event = function(type, data, bubbles, cancelable) {
  this.setBubbles(bubbles || false);
  this.setCancelable(cancelable || false);
  this.setData(data || {});
  this.setType(type);
};

SPITFIRE.Event.COMPLETE = 'complete';
SPITFIRE.Event.CHANGE = 'change';

SPITFIRE.Event.synthesizedProperties = ['bubbles', 'cancelable', 'data', 'target', 'type'];
SPITFIRE.Event.superclass = SPITFIRE.Object;
SPITFIRE.Class(SPITFIRE.Event);