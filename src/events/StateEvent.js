SPITFIRE.events = SPITFIRE.events || {};

//--------------------------------------
// SPITFIRE.events.StateEvent
//--------------------------------------

SPITFIRE.events.StateEvent = function(type, data, bubbles, cancelable) {
  this.callSuper(type, data, bubbles, cancelable);
};

SPITFIRE.events.StateEvent.CHILD_STATE_CHANGE = 'childStateChange';
SPITFIRE.events.StateEvent.STATE_CHANGE = 'stateChange';
SPITFIRE.events.StateEvent.STATE_ACTIVATED = 'stateActivated';

SPITFIRE.events.StateEvent.superclass = SPITFIRE.events.Event;
SPITFIRE.Class(SPITFIRE.events.StateEvent);