SPITFIRE.tasks = SPITFIRE.tasks || {};

//--------------------------------------
// SPITFIRE.tasks.ParallelTask
//--------------------------------------

SPITFIRE.tasks.ParallelTask = function() {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.tasks.ParallelTask');
  
  if (arguments.length > 0) {
    this.tasks(arguments);
  }
};

SPITFIRE.tasks.ParallelTask.superclass = SPITFIRE.tasks.TaskManager;

SPITFIRE.tasks.ParallelTask.prototype = {
  //--------------------------------------
  // Event Handlers
  //--------------------------------------
  
  taskCompleteHandler: function(event) {
    var task = event.target();
		if (this.debug()) {
			log("taskComplete " + task);
		}
		task.removeEventListener(SPITFIRE.events.Event.COMPLETE, this.taskCompleteHandler.context(this));
		this._createdTasks.push(task);
		if (this._createdTasks.length == this.tasks().length) {
		  if (this.debug()) {
		    log('tasksComplete ' + this);
		  }
			this.complete();
		}
  },
  
  //--------------------------------------
  // Methods
  //--------------------------------------
  
  start: function() {
    this._createdTasks = [];
    if (this.tasks().length > 0) {
      var i, len;
      for (i = 0, len = this.tasks().length; i < len; i += 1) {
        	var task = this.tasks()[i];
        	task.addEventListener(SPITFIRE.events.Event.COMPLETE, this.taskCompleteHandler.context(this));
        	if (this.debug()) {
        	 log('taskStart ' + task);
        	}
        	task.start();
      }
    } else {
      this.complete();
    }
  },

  toString: function() {
    return '[' + this.qualifiedClassName() + ' name=' + this.name() + ']';
  }
};

SPITFIRE.Class(SPITFIRE.tasks.ParallelTask);
