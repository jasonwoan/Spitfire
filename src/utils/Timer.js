//--------------------------------------
// Timer
//--------------------------------------

SPITFIRE.Timer = function(delay, repeatCount) {
  this.callSuper();
  this.delay(delay);
  this.repeatCount(repeatCount || 0);
  this.qualifiedClassName('SPITFIRE.Timer');
  this._interval;
  this._currentCount = 0;
};

SPITFIRE.Timer.superclass = SPITFIRE.EventDispatcher;
SPITFIRE.Timer.synthesizedProperties = [
  'currentCount',
  'delay',
  'repeatCount',
  'running'
];

SPITFIRE.Timer.prototype = {
  setRunning: function(value) {
    throw new SPITFIRE.Error('running is read-only');
  },
  
  setCurrentCount: function(value) {
    throw new SPITFIRE.Error('currentCount is read-only');
  },
  
  reset: function() {
    this.stop();
    this._currentCount = 0;
  },
  
  start: function() {
    if (this._interval) return;
    
    if (this.repeatCount() && this.currentCount() >= this.repeatCount()) return;
    
    this._interval = setTimeout(this.tick.context(this), this.delay());
  },
  
  stop: function() {
    if (this._interval) {
      clearTimeout(this._interval);
    }
    
    this._interval = undefined;
  },
  
  tick: function() {
    this._currentCount += 1;
    if (this.repeatCount() && this._currentCount >= this.repeatCount()) {
      this.trigger(new SPITFIRE.TimerEvent(SPITFIRE.TimerEvent.TIMER_COMPLETE));
      this.reset();
      return;
    }
    
    this._interval = setTimeout(this.tick.context(this), this.delay());
    this.trigger(new SPITFIRE.TimerEvent(SPITFIRE.TimerEvent.TIMER));
  }
}

SPITFIRE.Class(SPITFIRE.Timer);