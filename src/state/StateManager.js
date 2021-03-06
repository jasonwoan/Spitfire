/*global SPITFIRE, log*/

//--------------------------------------
// SPITFIRE.StateManager
//--------------------------------------

SPITFIRE.StateManager = function(name, root) {
  this.callSuper();
  this.setRoot(root);
  this.setQualifiedClassName('SPITFIRE.StateManager');
  this.setName(name || this.getQualifiedClassName() + ~~(Math.random() * 100000));
  this.setPageViewType(SPITFIRE.StateManager.PAGE_VIEW_LOCATION);
  this._progressTimer = new SPITFIRE.Timer(33);
  this._progressTimer.bind(SPITFIRE.TimerEvent.TIMER, this.taskManagerProgressHandler.context(this));
  this._transitionInPath = undefined;
  this._transitionWasInterrupted = undefined;
  this._isInTransition = undefined;
  this._transitions = undefined;
  this._currentTransition = undefined;
  this._redirects = [];
};

SPITFIRE.StateManager.PAGE_VIEW_LOCATION = 'pageViewLocation';
SPITFIRE.StateManager.PAGE_VIEW_NAME = 'pageViewName';

SPITFIRE.StateManager.superclass = SPITFIRE.EventDispatcher;
SPITFIRE.StateManager.synthesizedProperties = [
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

SPITFIRE.StateManager.prototype = {
  //--------------------------------------
  // Getters / Setters
  //--------------------------------------
  
  setDeepLinking: function(value) {
    this._deepLinking = value;
    if (this.getDeepLinking()) {
      this.getDeepLinking().change(this.deepLinkingChangeHandler.context(this));
    }
  },
  
  setTree: function(value) {
    this._tree = value;
    value.setStateManager(this);
    value.setRoot(this.root());
    value.setDebug(this._debug);
  },
  
  getLocation: function() {
    var states = this.getSelectedStates(),
        loc = '',
        i, len, inlineState;
        
    for (i = 0, len = states.length; i < len; i+=1) {
      inlineState = states[i];
      loc += inlineState.getName();
      if (inlineState !== states[states.length - 1]) {
        loc += '/';
      }
    }
    
    return loc;
  },
  
  setLocation: function(value) {
		var array, loc, locationArray, state;
		
    if (this.getDeepLinking()) {
      array = value.split('/');
      array.shift();
      loc = '/' + array.join('/');
      this.getDeepLinking().value(loc);
    } else {
      locationArray = value.split('/');
      locationArray.shift();
      state = this.getTree();
      if (locationArray.length > 0) {
        state = state.getChildFromPath(locationArray.join('/'));
      }
      
      this._transitionInPath = state.getStateLocation();
      this.checkIfInTransition();
    }
  },
  
  getSelectedStates: function() {
    var states = [],
        state;
        
    if (this.getTree().getSelected()) {
      state = this.getTree();
    }
    
    while (state) {
      states.push(state);
      state = state.getSelectedChild();
    }
    
    return states;
  },
  
  //--------------------------------------
  // Event Handlers
  //--------------------------------------
  
  deepLinkingChangeHandler: function(event) {
    var path = this.getDeepLinking().value();
		
    if (path === '' || path === '/') {
      this._transitionInPath = this.getTree().getStateLocation();
    } else {
      this._transitionInPath = this.getTree().getName() + path;
    }
		
		this.trigger(new SPITFIRE.StateManagerEvent(SPITFIRE.StateManagerEvent.DEEPLINK, { path: path }));
		
    this.checkIfInTransition();
  },
  
  taskManagerProgressHandler: function(event) {
    var totalProgress = this.getTaskManager().getProgress();
    if (this.getDebug()) {
      log(this.getName() + ' totalProgress = ' + totalProgress);
    }
    
    if (isNaN(totalProgress)) {
      totalProgress = 0;
    }
    
    if (typeof this.getPreloader() !== 'undefined') {
      this.getPreloader().setProgress(totalProgress);
    }
  },
    
  transitionInCompleteHandler: function(event) {
    if (this.getTrackPageViews()) {
      var param;
      switch(this.getPageViewType()) {
				case SPITFIRE.StateManager.PAGE_VIEW_LOCATION:
					param = this.getLocation();
				break;
				case SPITFIRE.StateManager.PAGE_VIEW_NAME:
					param = this.getLocation();
				break;
      }
    }
  },
  
  taskManagerCompleteHandler: function(event) {
    this.getTaskManager().unbind(SPITFIRE.Event.COMPLETE, this.taskManagerCompleteHandler.context(this));
    if (this.getTaskManager().getProgressive()) {
      this.taskManagerProgressHandler();
      this._progressTimer.stop();
    }
    this.trigger(new SPITFIRE.Event(this._currentTransition.transitionName() + "Complete"));
    this._currentTransition = null;
    if (this._transitions.length > 0) {
      this.startTransition();
    } else {
      this._transitions = null;
      this._isInTransition = false;
      if (this._transitionWasInterrupted) {
	      this.startTransitions();
      } else {
				this.trigger(new SPITFIRE.StateManagerEvent(SPITFIRE.StateManagerEvent.BROWSE_COMPLETE));
			}
    }
  },
  
  //--------------------------------------
  // Methods
  //--------------------------------------
  
  init: function() {
    if (this.getDeepLinking()) {
      if (this.getDeepLinking().value() !== '/') {
        this.deepLinkingChangeHandler();
      } else
      if (this.getStartLocation()) {
        this.location(this.getStartLocation());
      } else {
        this._transitionInPath = this.getTree().getStateLocation();
        this.checkIfInTransition(); 
      }
    } else 
    if (this.getStartLocation()) {
      this.location(this.getStartLocation());
    } else {
      this._transitionInPath = this.getTree().getStateLocation();
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
    this._isInTransition = true;
    
    this._transitionInPath = this.checkRedirect(this._transitionInPath);
    
		var nextLocationArray = this._transitionInPath.split('/'),
				locationPathArray = [],
				transitionOutPaths = [],
				transitionInPaths = [],
				breakIndex = 0, i, len, currentArray, currentPath, nextArray, nextPath;
				
    if (this.getLocation().length > 0) {
      locationPathArray = this.getLocation().split('/');
    }

    for (i = 0, len = locationPathArray.length; i < len; i+=1) {
      currentArray = locationPathArray.slice(0, i + 1);
      currentPath = currentArray.join('/');
      nextArray = nextLocationArray.slice(0, i + 1);
      nextPath = nextArray.join('/');
      if (currentPath === nextPath) {
        breakIndex += 1;
      }
    }
    
    this._transitions = [];
    
    for (i = locationPathArray.length - 1; i >= breakIndex; i-=1) {
      currentArray = locationPathArray.slice(0, i + 1);
      transitionOutPaths.push(currentArray.join('/'));
    }
    
    this.deactivateStates(transitionOutPaths);
    
    this._transitions.push(new SPITFIRE.TransitionProperties(transitionOutPaths.slice(), 'loadOut', false));
    this._transitions.push(new SPITFIRE.TransitionProperties(transitionOutPaths.slice(), 'transitionOut', false));
    
    for (i = breakIndex, len = nextLocationArray.length; i < len; i+=1) {
      nextArray = nextLocationArray.slice(0, i + 1);
      transitionInPaths.push(nextArray.join('/'));
    }

    transitionInPaths = this.activateStates(transitionInPaths);

    if (transitionInPaths.length === 0) {
      transitionInPaths = this.checkForDefaultStates(this._transitionInPath);
    }
    
    this._transitions.push(new SPITFIRE.TransitionProperties(transitionInPaths.slice(), 'loadIn', false));
    this._transitions.push(new SPITFIRE.TransitionProperties(transitionInPaths.slice(), 'transitionIn', false));
    
    this.startTransition();
  },
  
  deactivateStates: function(transitionPaths) {
    var i, len, path, pathArray, state, j, len2, currentState;
    for (i = 0, len = transitionPaths.length; i < len; i+=1) {
      path = transitionPaths[i];
      pathArray = path.split('/');
      pathArray.shift();
      state = this.getTree();
      if (pathArray.length > 0) {
        for (j = 0, len2 = pathArray.length; j < len2; j+=1) {
          currentState = state;
          state = currentState.getChildByName(pathArray[j]);
        }
      }
      
      state.activated(false);
    }
  },
  
  activateStates: function(transitionPaths) {
    var newPaths = [], i, len, path, pathArray, state, j, len2, currentState, defaultState;
    this._activeStates = [];
    for (i = 0, len = transitionPaths.length; i < len; i += 1) {
      path = transitionPaths[i];
      pathArray = path.split("/");
      pathArray.shift();
      state = this.getTree();
      
      if (pathArray.length > 0) {
				for (j = 0, len2 = pathArray.length; j < len2; j += 1) {
					currentState = state;
					state = currentState.getChildByName(pathArray[j]);
					if (!state) {
						state = currentState.createChildByName(pathArray[j]);
					}
				}
      }
      
      state.setActivated(true);
      this.getActiveStates().push(state);
      newPaths.push(state.getStateLocation());
      
      if (state.getStateLocation() === transitionPaths[transitionPaths.length - 1]) {
				defaultState = state.getChildByName(state.defaultChild());
				while (defaultState) {
					defaultState.setActivated(true);
					this.getActiveStates().push(defaultState);
					newPaths.push(defaultState.getStateLocation());
					defaultState = defaultState.getChildByName(defaultState.getDefaultChild());
				}
			}  
    }
    
    return newPaths;
  },
  
  checkForDefaultStates: function(path) {
    var newPaths = [],
				pathArray = path.split("/"),
				state = this.getTree(),
				i, len, currentState, defaultState;
		
		pathArray.shift();
		if (pathArray.length > 0) {
			for (i = 0, len = pathArray.length; i < len; i += 1) {
				currentState = state;
				state = currentState.getChildByName(pathArray[i]);
			}
		}
		
		defaultState = state.getChildByName(state.defaultChild);
		while (defaultState) {
			defaultState.setActivated(true);
			this.getActiveStates().push(defaultState);
			newPaths.push(defaultState.getStateLocation());
			defaultState = defaultState.getChildByName(defaultState.getDefaultChild());
		}
		
		return newPaths;
  },
  
  startTransition: function() {
    this._currentTransition = this._transitions.shift();
    this.trigger(new SPITFIRE.Event(this._currentTransition.getTransitionName() + "Start"));
    
    this.setTaskManager(new SPITFIRE.SequentialTask());
    
    this.getTaskManager().setName(this._currentTransition.getTransitionName());
    if (this.getDebug()) {
	    this.getTaskManager().setDebug(this.getDebug());
    }
    
    this.getTaskManager().bind(SPITFIRE.Event.COMPLETE, this.taskManagerCompleteHandler.context(this));
    
    var i, len, path, pathArray, state, task, stateSelected;
    
    for (i = 0, len = this._currentTransition.getLocations().length; i < len; i += 1) {
      path = this._currentTransition.getLocations()[i];
      pathArray = path.split("/");
      pathArray.shift();
      state = this.getTree();
      if (pathArray.length > 0) {
	      state = state.getChildFromPath(pathArray.join("/"));
      }
      task = state[this._currentTransition.getTransitionName()]();
      
      if (task) {
	      this.getTaskManager().addTask(task);
      }
      stateSelected = false;
      if (this._currentTransition.getTransitionName() === "transitionIn") {
	      stateSelected = true;
      }
      if (this._currentTransition.getTransitionName() === "transitionOut") {
	      stateSelected = false;
      }

      this.getTaskManager().addTask(new SPITFIRE.PropertyTask(state, "selected", stateSelected));
    }
    if (this.getTaskManager().getProgress() === 1) {
	    this.getTaskManager().getProgressive(false);
    }
    if (this.getTaskManager().getProgressive()) {
	    if (this.getPreloader()) {
		    this.getTaskManager().addTaskAt(new SPITFIRE.PropertyTask(this.getPreloader(), "progress", 0), 0);
		    this.getTaskManager().addTaskAt(this.getPreloader().getTransitionIn(), 1);
		    this.getTaskManager().addTask(this.getPreloader().getTransitionOut());
	    }
	    this.getTaskManager().setProgress(0);
	    this._progressTimer.start();
    }
    this.getTaskManager().start();
  },
  
  addRedirect: function(location, newLocation) {
    this.removeRedirect(location);
		this.redirects.push(new SPITFIRE.Redirect(location, newLocation));
  },
  
  removeRedirect: function(location) {
    var newRedirects = [],
				i, len, redirect;
		for (i = 0, len = this.getRedirects().length; i < len; i += 1) {
		  redirect = this.getRedirects()[i];
			if (redirect.getLocation() !== location) {
				newRedirects.push(redirect);
			}
		}
		this.setRedirects(newRedirects);
  },
  
  checkRedirect: function(path) {
    var i, len, redirect;
		for (i = 0, len = this.getRedirects().length; i < len; i += 1) {
		  redirect = this.getRedirects()[i];
			if (path === redirect.getLocation()) {
				path = redirect.getNewLocation();
			}
		}
		
		return path;
  },
  
  toString: function() {
    return '[StateManager' + ' name=' + this.getName() + ' className = ' + this.getQualifiedClassName() + ']';
  }
};

SPITFIRE.Class(SPITFIRE.StateManager);