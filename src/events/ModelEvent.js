//--------------------------------------
// SPITFIRE.ModelEvent
//--------------------------------------

SPITFIRE.ModelEvent = function(type, data, bubbles, cancelable) {
  this.callSuper(type, data, bubbles, cancelable);
};

SPITFIRE.ModelEvent.DATA_UPDATE = 'dataUpdate';

SPITFIRE.ModelEvent.superclass = SPITFIRE.Event;
SPITFIRE.Class(SPITFIRE.ModelEvent);