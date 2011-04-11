SPITFIRE.events = SPITFIRE.events || {};

//--------------------------------------
// SPITFIRE.events.ModelEvent
//--------------------------------------

SPITFIRE.events.ModelEvent = function(type, data, bubbles, cancelable) {
  this.callSuper(type, data, bubbles, cancelable);
};

SPITFIRE.events.ModelEvent.DATA_UPDATE = 'dataUpdate';

SPITFIRE.events.ModelEvent.superclass = SPITFIRE.events.Event;
SPITFIRE.Class(SPITFIRE.events.ModelEvent);