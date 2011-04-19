//--------------------------------------
// StateManagerEvent
//--------------------------------------

SPITFIRE.StateManagerEvent = function(type, data, bubbles, cancelable, state) {
  this.callSuper(type, data, bubbles, cancelable);
  this.state(state);
  this.qualifiedClassName('SPITFIRE.StateManagerEvent');
};

SPITFIRE.StateManagerEvent.LOAD_IN_START = 'loadInStart';
SPITFIRE.StateManagerEvent.LOAD_IN_COMPLETE = 'loadInComplete';
SPITFIRE.StateManagerEvent.TRANSITION_IN_START = 'transitionInStart';
SPITFIRE.StateManagerEvent.TRANSITION_IN_COMPLETE = 'transitionInComplete';
SPITFIRE.StateManagerEvent.LOAD_OUT_START = 'loadOutStart';
SPITFIRE.StateManagerEvent.LOAD_OUT_COMPLETE = 'loadOutComplete';
SPITFIRE.StateManagerEvent.TRANSITION_OUT_START = 'transitionOutStart';
SPITFIRE.StateManagerEvent.TRANSITION_OUT_COMPLETE = 'transitionOutComplete';
SPITFIRE.StateManagerEvent.TRANSITION_IN_STATE_COMPLETE = 'transitionInStateComplete';
SPITFIRE.StateManagerEvent.TRANSITION_OUT_STATE_COMPLETE = 'transitionOutStateComplete';
SPITFIRE.StateManagerEvent.LOAD_IN_STATE_COMPLETE = 'loadInStateComplete';
SPITFIRE.StateManagerEvent.LOAD_OUT_STATE_COMPLETE = 'loadOutStateComplete';
SPITFIRE.StateManagerEvent.DEEPLINK = 'deeplink';

SPITFIRE.StateManagerEvent.superclass = SPITFIRE.Event;
SPITFIRE.StateManagerEvent.synthesizedProperties = ['state'];
SPITFIRE.Class(SPITFIRE.StateManagerEvent);