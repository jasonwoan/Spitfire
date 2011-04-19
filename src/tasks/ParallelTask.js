//--------------------------------------
// SPITFIRE.ParallelTask
//--------------------------------------

SPITFIRE.ParallelTask = function() {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.ParallelTask');
  
  if (arguments.length > 0) {
    this.tasks(arguments);
  }
};

SPITFIRE.ParallelTask.superclass = SPITFIRE.TaskManager;

SPITFIRE.ParallelTask.prototype = {
  //--------------------------------------
  // Event Handlers
  //--------------------------------------
  
  taskCompleteHandler: function(event) {
    var task = event.target();
		if (this.debug()) {
			log("taskComplete " + task);
		}
		task.unbind(SPITFIRE.Event.COMPLETE, this.taskCompleteHandler.context(this));
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
        	task.bind(SPITFIRE.Event.COMPLETE, this.taskCompleteHandler.context(this));
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

SPITFIRE.Class(SPITFIRE.ParallelTask);
