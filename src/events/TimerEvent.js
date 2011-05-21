/*global SPITFIRE*/

//--------------------------------------
// TimerEvent
//--------------------------------------

SPITFIRE.TimerEvent = function(type, data, bubbles, cancelable) {  
  this.callSuper(type, data, bubbles, cancelable);
  this.setQualifiedClassName('SPITFIRE.TimerEvent');
};

SPITFIRE.TimerEvent.TIMER = 'timer';
SPITFIRE.TimerEvent.TIMER_COMPLETE = 'timerComplete';

SPITFIRE.TimerEvent.superclass = SPITFIRE.Event;
SPITFIRE.Class(SPITFIRE.TimerEvent);