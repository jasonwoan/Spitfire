SPITFIRE.events = SPITFIRE.events || {};

//--------------------------------------
// TimerEvent
//--------------------------------------

SPITFIRE.events.TimerEvent = function(type, data, bubbles, cancelable) {  
  this.callSuper(type, data, bubbles, cancelable);
  this.qualifiedClassName('SPITFIRE.events.TimerEvent');
};

SPITFIRE.events.TimerEvent.TIMER = 'timer';
SPITFIRE.events.TimerEvent.TIMER_COMPLETE = 'timerComplete';

SPITFIRE.events.TimerEvent.superclass = SPITFIRE.events.Event;
SPITFIRE.Class(SPITFIRE.events.TimerEvent);