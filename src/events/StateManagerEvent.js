SPITFIRE.events = SPITFIRE.events || {};

//--------------------------------------
// StateManagerEvent
//--------------------------------------

SPITFIRE.events.StateManagerEvent = function(type, data, bubbles, cancelable, state) {
  this.callSuper(type, data, bubbles, cancelable);
  this.state(state);
  this.qualifiedClassName('SPITFIRE.events.StateManagerEvent');
};

SPITFIRE.events.StateManagerEvent.LOAD_IN_START = 'loadInStart';
SPITFIRE.events.StateManagerEvent.LOAD_IN_COMPLETE = 'loadInComplete';
SPITFIRE.events.StateManagerEvent.TRANSITION_IN_START = 'transitionInStart';
SPITFIRE.events.StateManagerEvent.TRANSITION_IN_COMPLETE = 'transitionInComplete';
SPITFIRE.events.StateManagerEvent.LOAD_OUT_START = 'loadOutStart';
SPITFIRE.events.StateManagerEvent.LOAD_OUT_COMPLETE = 'loadOutComplete';
SPITFIRE.events.StateManagerEvent.TRANSITION_OUT_START = 'transitionOutStart';
SPITFIRE.events.StateManagerEvent.TRANSITION_OUT_COMPLETE = 'transitionOutComplete';
SPITFIRE.events.StateManagerEvent.TRANSITION_IN_STATE_COMPLETE = 'transitionInStateComplete';
SPITFIRE.events.StateManagerEvent.TRANSITION_OUT_STATE_COMPLETE = 'transitionOutStateComplete';
SPITFIRE.events.StateManagerEvent.LOAD_IN_STATE_COMPLETE = 'loadInStateComplete';
SPITFIRE.events.StateManagerEvent.LOAD_OUT_STATE_COMPLETE = 'loadOutStateComplete';
SPITFIRE.events.StateManagerEvent.DEEPLINK = 'deeplink';

SPITFIRE.events.StateManagerEvent.superclass = SPITFIRE.events.Event;
SPITFIRE.events.StateManagerEvent.synthesizedProperties = ['state'];
SPITFIRE.Class(SPITFIRE.events.StateManagerEvent);