//--------------------------------------
// SPITFIRE.StateEvent
//--------------------------------------

SPITFIRE.StateEvent = function(type, data, bubbles, cancelable) {
  this.callSuper(type, data, bubbles, cancelable);
};

SPITFIRE.StateEvent.CHILD_STATE_CHANGE = 'childStateChange';
SPITFIRE.StateEvent.STATE_CHANGE = 'stateChange';
SPITFIRE.StateEvent.STATE_ACTIVATED = 'stateActivated';

SPITFIRE.StateEvent.superclass = SPITFIRE.Event;
SPITFIRE.Class(SPITFIRE.StateEvent);