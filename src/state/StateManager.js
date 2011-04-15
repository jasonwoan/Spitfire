SPITFIRE.state = SPITFIRE.state || {};

//--------------------------------------
// SPITFIRE.state.StateManager
//--------------------------------------

SPITFIRE.state.StateManager = function(name, root) {
  this.callSuper();
  this.root(root);
  this.qualifiedClassName('SPITFIRE.state.StateManager');
  this.name(name || this.qualifiedClassName() + ~~(Math.random() * 100000));
  this.pageViewType(SPITFIRE.state.StateManager.PAGE_VIEW_LOCATION);
  this._progressTimer = new SPITFIRE.utils.Timer(33);
  this._progressTimer.bind(SPITFIRE.events.TimerEvent.TIMER, this.taskManagerProgressHandler.context(this));
  this._transitionInPath;
  this._transitionWasInterrupted;
  this._isInTransition;
  this._transitions;
  this._currentTransition;
  this._redirects = [];
};

SPITFIRE.state.StateManager.PAGE_VIEW_LOCATION = 'pageViewLocation';
SPITFIRE.state.StateManager.PAGE_VIEW_NAME = 'pageViewName';

SPITFIRE.state.StateManager.superclass = SPITFIRE.events.EventDispatcher;
SPITFIRE.state.StateManager.synthesizedProperties = [
  'root',
  'deepLinking',
  'tree',
  'startLocation',
  'location',
  'activeStates',
  'taskManager',
  'preloader',
  'selectedStates',
  'debug',
  'trackViewPages',
  'pageViewType',
  'redirects',
  'name'
];

SPITFIRE.state.StateManager.prototype = {
  //--------------------------------------
  // Getters / Setters
  //--------------------------------------
  
  setDeepLinking: function(value) {
    this._deepLinking = value;
    if (this.deepLinking()) {
      this.deepLinking().change(this.deepLinkingChangeHandler.context(this));
    }
  },
  
  setTree: function(value) {
    this._tree = value;
    value.stateManager(this);
    value.root(this.root());
  },
  
  getLocation: function() {
    var states = this.selectedStates(),
        loc = '',
        i, len;
        
    for (i = 0, len = states.length; i < len; i+=1) {
      var inlineState = states[i];
      loc += inlineState.name();
      if (inlineState != states[states.length - 1]) {
        loc += '/';
      }
    }
    
    return loc;
  },
  
  setLocation: function(value) {
    if (this.deepLinking()) {
      var array = value.split('/');
      array.shift();
      var loc = '/' + array.join('/');
      this.deepLinking().value(loc);
    } else {
      var locationArray = value.split('/');
      locationArray.shift();
      var state = this.tree();
      if (locationArray.length > 0) {
        state = state.getChildFromPath(locationArray.join('/'));
      }
      
      this._transitionInPath = state.stateLocation();
      this.checkIfInTransition();
    }
  },
  
  getSelectedStates: function() {
    var states = [],
        state;
        
    if (this.tree().selected()) {
      state = this.tree();
    }
    
    while (state) {
      states.push(state);
      state = state.selectedChild();
    }
    
    return states;
  },
  
  //--------------------------------------
  // Event Handlers
  //--------------------------------------
  
  deepLinkingChangeHandler: function(event) {
    var path = this.deepLinking().value();
    if (path == '' || path == '/') {
      this._transitionInPath = this.tree().stateLocation();
    } else {
      this._transitionInPath = this.tree().name() + path;
    }
    
    this.checkIfInTransition();
  },
  
  taskManagerProgressHandler: function(event) {
    var totalProgress = this.taskManager().progress();
    if (this.debug()) {
      log(this.name() + ' totalProgress = ' + totalProgress);
    }
    
    if (isNaN(totalProgress)) {
      totalProgress = 0;
    }
    
    if (this.preloader()) {
      this.preloader().progress(totalProgress);
    }
  },
    
  transitionInCompleteHandler: function(event) {
    if (this.trackPageViews()) {
  		var param;
  		switch(this.pageViewType()) {
  			case SPITFIRE.state.StateManager.PAGE_VIEW_LOCATION:
  				param = this.location();
  			break;
  			case SPITFIRE.state.StateManager.PAGE_VIEW_NAME:
  				param = this.location();
  			break;
  		}
  	}
  },
  
  taskManagerCompleteHandler: function(event) {
    this.taskManager().unbind(SPITFIRE.events.Event.COMPLETE, this.taskManagerCompleteHandler.context(this));
		if (this.taskManager().progressive()) {
			this.taskManagerProgressHandler();
			this._progressTimer.stop();
		}
		
		this.trigger(new SPITFIRE.events.Event(this._currentTransition.transitionName() + "Complete"));
		this._currentTransition = null;
		if (this._transitions.length > 0) {
			this.startTransition();
		} else {
			this._transitions = null;
			this._isInTransition = false;
			if (this._transitionWasInterrupted) {
				this.startTransitions();
			}
		}
  },
  
  //--------------------------------------
  // Methods
  //--------------------------------------
  
  init: function() {
    if (this.deepLinking()) {
      if (this.deepLinking().value() != '/') {
        this.deepLinkingChangeHandler();
      } else
      if (this.startLocation()) {
        this.location(this.startLocation());
      } else {
        this._transitionInPath = this.tree().stateLocation();
        this.checkIfInTransition(); 
      }
    } else 
    if (this.startLocation()) {
      this.location(this.startLocation());
    } else {
      this._transitionInPath = this.tree().stateLocation();
      this.checkIfInTransition();
    }
  },
  
  checkIfInTransition: function() {
    if (this._isInTransition) {
      this._transitionWasInterrupted = true;
    } else {
      this.startTransitions();
    }
  },
  
  startTransitions: function() {
    
    this._transitionWasInterrupted = false;
    this._isInTransition = false;
    
    this._transitionInPath = this.checkRedirect(this._transitionInPath);
    
    var nextLocationArray = this._transitionInPath.split('/');
    
    var locationPathArray = [];
    if (this.location().length > 0) {
      locationPathArray = this.location().split('/');
    }
    
    var breakIndex = 0, i, len, currentArray, currentPath, nextArray, nextPath;

    for (i = 0, len = locationPathArray.length; i < len; i+=1) {
      currentArray = locationPathArray.slice(0, i + 1);
      currentPath = currentArray.join('/');
      nextArray = nextLocationArray.slice(0, i + 1);
      nextPath = nextArray.join('/');
      if (currentPath == nextPath) {
        breakIndex += 1;
      }
    }
    
    this._transitions = [];
    
    var transitionOutPaths = [];
    for (i = locationPathArray.length - 1; i >= breakIndex; i-=1) {
      currentArray = locationPathArray.slice(0, i + 1);
      transitionOutPaths.push(currentArray.join('/'));
    }
    
    this.deactivateStates(transitionOutPaths);
    
    this._transitions.push(new SPITFIRE.state.TransitionProperties(transitionOutPaths.slice(), 'loadOut', false));
    this._transitions.push(new SPITFIRE.state.TransitionProperties(transitionOutPaths.slice(), 'transitionOut', false));
    
    var transitionInPaths = [];
    for (i = breakIndex, len = nextLocationArray.length; i < len; i+=1) {
      nextArray = nextLocationArray.slice(0, i + 1);
      transitionInPaths.push(nextArray.join('/'));
    }

    transitionInPaths = this.activateStates(transitionInPaths);

    if (transitionInPaths.length == 0) {
      transitionInPaths = this.checkForDefaultStates(this._transitionInPath);
    }
    
    this._transitions.push(new SPITFIRE.state.TransitionProperties(transitionInPaths.slice(), 'loadIn', false));
    this._transitions.push(new SPITFIRE.state.TransitionProperties(transitionInPaths.slice(), 'transitionIn', false));
    
    this.startTransition();
  },
  
  deactivateStates: function(transitionPaths) {
    var i, len;
    for (i = 0, len = transitionPaths.length; i < len; i+=1) {
      var path = transitionPaths[i];
      var pathArray = path.split('/');
      pathArray.shift();
      var state = this.tree();
      if (pathArray.length > 0) {
        var j, len2;
        for (j = 0, len2 = pathArray.length; j < len2; j+=1) {
          var currentState = state;
          state = currentState.getChildByName(pathArray[j]);
        }
      }
      
      state.activated(false);
    }
  },
  
  activateStates: function(transitionPaths) {
    var newPaths = [], i, len;
		this._activeStates = [];
		for (i = 0, len = transitionPaths.length; i < len; i += 1) {
		  var path = transitionPaths[i];
			var pathArray = path.split("/");
			pathArray.shift();
			var state = this.tree();
			
      if (pathArray.length > 0) {
        var j, len2;
				for (j = 0, len2 = pathArray.length; j < len2; j += 1) {
					var currentState = state;
					state = currentState.getChildByName(pathArray[j]);
					if (!state) {
						state = currentState.createChildByName(pathArray[j]);
					}
				}
			}
			
			state.activated(true);
			this.activeStates().push(state);
			newPaths.push(state.stateLocation());
			
			if (state.stateLocation() == transitionPaths[transitionPaths.length - 1]) {
				var defaultState = state.getChildByName(state.defaultChild());
				while (defaultState) {
					defaultState.activated(true);
					this.activeStates().push(defaultState);
					newPaths.push(defaultState.stateLocation());
					defaultState = defaultState.getChildByName(defaultState.defaultChild());
				}
			}
			
		}
		
		return newPaths;
  },
  
  checkForDefaultStates: function(path) {
    var newPaths = [];
		var pathArray = path.split("/");
		pathArray.shift();
		var state = this.tree();
		if (pathArray.length > 0) {
		  var i, len;
			for (i = 0, len = pathArray.length; i < len; i += 1) {
				var currentState = state;
				state = currentState.getChildByName(pathArray[i]);
			}
		}
		var defaultState = state.getChildByName(state.defaultChild);
		while (defaultState) {
			defaultState.activated(true);
			this.activeStates().push(defaultState);
			newPaths.push(defaultState.stateLocation());
			defaultState = defaultState.getChildByName(defaultState.defaultChild());
		}
		
		return newPaths;
  },
  
  startTransition: function() {
    this._currentTransition = this._transitions.shift();
		this.trigger(new SPITFIRE.events.Event(this._currentTransition.transitionName() + "Start"));
		
		this.taskManager(new SPITFIRE.tasks.SequentialTask());
		
		this.taskManager().name(this._currentTransition.transitionName());
		if (this.debug()) {
			this.taskManager().debug(this.debug());
		}
		
		this.taskManager().bind(SPITFIRE.events.Event.COMPLETE, this.taskManagerCompleteHandler.context(this));
		
		var i, len;
		
		for (i = 0, len = this._currentTransition.locations().length; i < len; i += 1) {
		  var path = this._currentTransition.locations()[i];
			var pathArray = path.split("/");
			pathArray.shift();
			var state = this.tree();
			if (pathArray.length > 0) {
				state = state.getChildFromPath(pathArray.join("/"));
			}
			var task = state[this._currentTransition.transitionName()]();
			
			if (task) {
				this.taskManager().addTask(task);
			}
			var stateSelected;
			if (this._currentTransition.transitionName() == "transitionIn") {
				stateSelected = true;
			}
			if (this._currentTransition.transitionName() == "transitionOut") {
				stateSelected = false;
			}
			this.taskManager().addTask(new SPITFIRE.tasks.PropertyTask(state, "selected", stateSelected));
		}
		if (this.taskManager().progress() == 1) {
			this.taskManager().progressive(false);
		}
		if (this.taskManager().progressive()) {
			if (this.preloader()) {
				this.taskManager().addTaskAt(new SPITFIRE.tasks.PropertyTask(this.preloader(), "progress", 0), 0);
				this.taskManager().addTaskAt(this.preloader().transitionIn(), 1);
				this.taskManager().addTask(this.preloader().transitionOut());
			}
			this.taskManager().progress(0);
			this._progressTimer.start();
		}
		this.taskManager().start();
  },
  
  addRedirect: function(location, newLocation) {
    this.removeRedirect(location);
		this.redirects.push(new SPITFIRE.state.Redirect(location, newLocation));
  },
  
  removeRedirect: function(location) {
    var newRedirects = [];
    var i, len;
		for (i = 0, len = this.redirects().length; i < len; i += 1) {
		  var redirect = this.redirects()[i];
			if (redirect.location() != location) {
				newRedirects.push(redirect);
			}
		}
		this.redirects(newRedirects);
  },
  
  checkRedirect: function(path) {
    var i, len;
		for (i = 0, len = this.redirects().length; i < len; i += 1) {
		  var redirect = redirects()[i];
			if (path == redirect.location()) {
				path = redirect.newLocation();
			}
		}
		
		return path;
  },
  
  toString: function() {
    return '[StateManager' + ' name=' + this.name() + ' className = ' + this.qualifiedClassName() + ']';
  }
};

SPITFIRE.Class(SPITFIRE.state.StateManager);