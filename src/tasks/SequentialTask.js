//--------------------------------------
// SPITFIRE.SequentialTask
//--------------------------------------

SPITFIRE.SequentialTask = function() {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.SequentialTask');
  
  if (arguments.length > 0) {
    this.tasks(arguments);
  }
};

SPITFIRE.SequentialTask.superclass = SPITFIRE.TaskManager;
SPITFIRE.SequentialTask.synthesizedProperties = [];

SPITFIRE.SequentialTask.prototype = {

  //--------------------------------------
  // Event Handlers
  //--------------------------------------
  
  taskCompleteHandler: function(event) {
    var task = event.target();
    if (this.debug()) {
      log("taskComplete " + task);
    }
    task.unbind(SPITFIRE.Event.COMPLETE);
    this._createdTasks.push(task);
    if (this._createdTasks.length == this.tasks().length) {
      this.complete();
    } else {
      this.createTask();
    }
  },
  
  //--------------------------------------
  // Methods
  //--------------------------------------
  
  start: function() {
    this._createdTasks = [];
    if (this.tasks().length > 0) {
      this.createTask();
    } else {
      this.complete();
    }
  },
  
  createTask: function() {
    var index = this._createdTasks.length;
		var task = this.tasks()[index];
		task.bind(SPITFIRE.Event.COMPLETE, this.taskCompleteHandler.context(this));
		if (this.debug()) {
			log("taskStart " + task);
		}
		task.start();
  },

  toString: function() {
    return '[' + this.qualifiedClassName() + ' name=' + this.name() +']';
  }
};

SPITFIRE.Class(SPITFIRE.SequentialTask);