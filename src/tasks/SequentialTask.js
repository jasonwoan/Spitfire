SPITFIRE.tasks = SPITFIRE.tasks || {};

//--------------------------------------
// SPITFIRE.tasks.SequentialTask
//--------------------------------------

SPITFIRE.tasks.SequentialTask = function() {
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.tasks.SequentialTask');
  
  if (arguments.length > 0) {
    this.tasks(arguments);
  }
};

SPITFIRE.tasks.SequentialTask.superclass = SPITFIRE.tasks.TaskManager;
SPITFIRE.tasks.SequentialTask.synthesizedProperties = [];

SPITFIRE.tasks.SequentialTask.prototype = {

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
		task.addEventListener(SPITFIRE.events.Event.COMPLETE, this.taskCompleteHandler.context(this));
		if (this.debug()) {
			log("taskStart " + task);
		}
		task.start();
  },

  toString: function() {
    return '[' + this.qualifiedClassName() + ' name=' + this.name() +']';
  }
};

SPITFIRE.Class(SPITFIRE.tasks.SequentialTask);