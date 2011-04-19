//--------------------------------------
// SPITFIRE.TaskManager
//--------------------------------------

SPITFIRE.TaskManager = function() {
  this._progressiveTasks = [];
  this._createdTasks = [];
  this._tasks = [];
  
  this.callSuper();
  this.qualifiedClassName('SPITFIRE.TaskManager');
};

SPITFIRE.TaskManager.superclass = SPITFIRE.Task;
SPITFIRE.TaskManager.synthesizedProperties = ['tasks'];

SPITFIRE.TaskManager.prototype = {
  //--------------------------------------
  // Getters / Setters
  //--------------------------------------
  
  setTasks: function(value) {    
    var i, len;
    for (i = 0, len = this._tasks.length; i < len; i += 1) {
      	this.removeTask(this.tasks()[i]);
    }
    
    this._tasks = [];
    
    for (i = 0, len = value.length; i < len; i += 1) {
    	this.addTask(value[i]);
    }
  },
  
  getProgress: function() {
    var loadedProgress = 0,
        i, len;
    for (i = 0, len = this._progressiveTasks.length; i < len; i += 1) {
    	var task = this._progressiveTasks[i];
    	loadedProgress += task.progress;
    }
    
		return loadedProgress / Math.max(this._progressiveTasks.length, 1);
  },
  
  setProgress: function(value) {
		var i, len;
		for (i = 0, len = this._progressiveTasks.length; i < len; i += 1) {
			this._progressiveTasks[i].progress(value);
		}
  },
  
  setDebug: function(value) {
    this.callSuper(value);
    var i, len;
    for (i = 0, len = this.tasks().length; i < len; i += 1) {
      this.tasks()[i].debug(value);
    }
  },
  
  //--------------------------------------
  // Methods
  //--------------------------------------
  
  addTask: function(task) {
    if (task) {
      this._tasks.push(task);
      if (task.progressive()) {
        this._progressiveTasks.push(task);
      }
      
      if (this.debug()) {
        task.debug(this.debug());
      }
      this.setProgressive();
    }
    
    return task;
  },
  
  addTaskAt: function(task, index) {
    if (task) {
			if (task.progressive()) {
				this._progressiveTasks.push(task);
				this.progressive(true);
			}
			this.tasks().splice(index, 0, task);
			if (this.debug()) {
				task.debug(this.debug());
			}
			this.setProgressive();
		}
		return task;
  },
  
  contains: function(task) {
    return this.tasks().indexOf(task) != -1;
  },
  
  getTaskAt: function(index) {
    return this.tasks()[index];
  },
  
  getTaskByName: function(name) {
    var taskFound, i, len;
    for (i = 0, len = this.tasks().length; i < len; i += 1) {
    	var task = this.tasks()[i];
    	if (task.name() == name) {
				taskFound = task;
				break;
			}
    }
    
		return taskFound;  
  },
  
  getTaskIndex: function(task) {
    if (!this.contains(task)) {
			throw new SPITFIRE.Error("The supplied task must be a child of the caller.");
		}

		return this.tasks().indexOf(task);
  },
  
  removeTask: function(task) {
    if (!this.contains(task)) {
			throw new SPITFIRE.Error("The supplied task must be a child of the caller.");
		}
		var index = this.getTaskIndex(task);
		if (index != -1) {
			this.removeTaskAt(index);
		}
		this.setProgressive();
		return task;
  },
  
  removeTaskAt: function(index) {
    var task = this.getTaskAt(index);
		this.tasks().splice(index, 1);
		var progressiveIndex = this._progressiveTasks.indexOf(task);
		if (progressiveIndex != -1) {
			this._progressiveTasks.splice(progressiveIndex, 1);
		}
		this.setProgressive();
		return task;
  },
  
  setTaskIndex: function(task, index) {
    if (!this.contains(task)) {
			throw new SPITFIRE.Error("The supplied task must be a child of the caller.");
		}
		var taskIndex = this.getTaskIndex(task);
		this.tasks().splice(index, 0, this.tasks()[taskIndex]);
		this.tasks().splice(taskIndex, 1);
  },
  
  swapTasksAt: function(index1, index2) {
    var temp = this.tasks()[index1];
		this.tasks()[index1] = this.tasks()[index2];
		this.tasks()[index2] = temp;
  },
  
  setProgressive: function() {
    this._progressive = (this._progressiveTasks.length > 0);
  },

  toString: function() {
    return '[' + this.qualifiedClassName() + ']';
  }
};

SPITFIRE.Class(SPITFIRE.TaskManager);