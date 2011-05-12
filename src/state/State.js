//--------------------------------------
// SPITFIRE.State
//--------------------------------------

SPITFIRE.State = function(name) {
  this.callSuper();
  this.setName(name);
  this._children = [];
  this._selected = false;
  this._debug = false;
  this.setQualifiedClassName('SPITFIRE.State');
};

SPITFIRE.State.superclass = SPITFIRE.EventDispatcher;
SPITFIRE.State.synthesizedProperties = [
  'root',
  'debug',
  'children',
  'stateManager',
  'parent',
  'name',
  'title',
  'description',
  'defaultChild',
  'selectedChild',
  'activatedChild',
  'selectedChildIndex',
  'selected',
  'index',
  'stateLocation',
  'selectable',
  'pageViewName',
  'numChildren',
  'transitionIn',
  'transitionOut',
  'loadIn',
  'loadOut',
  'activated',
  'childClass'
];

SPITFIRE.State.prototype = {
  //--------------------------------------
  // Getters / Setters
  //--------------------------------------
  
  setRoot: function(value) {
    this._root = value;
    for (var i = 0, len = this._children.length; i < len; i+=1) {
      this._children[i].setRoot(this._root);
    }
  },
  
  setStateManager: function(value) {
    this._stateManager = value;
    for (var i = 0, len = this._children.length; i < len; i+=1) {
      this._children[i].setStateManager(this.stateManager());
    }
  },
  
  setChildren: function(value) {
    for (var i = 0, len = this._children.length; i < len; i+=1) {
      this.removeChild(this._children[i]);
    }
    
    this._children = [];
    
    for (i = 0, len = value.length; i < len; i++) {
      this.addChild(value[i]);
    }
  },
  
  setSelectedChild: function(value) {
    if (!this.contains(value)) {
      throw new SPITFIRE.Error('The supplied child must be a child of the caller.');
    }
    
    this._selectedChild = value;
  },
  
  getActivatedChild: function() {
    var state, i, len;
    for (i = 0, len = this._children.length; i < len; i+=1) {
      child = this._children[i];
      if (child.activated) {
        state = child;
        break;
      }
    }
    return state;
  },
  
  getNumChildren: function() {
    return this._children.length;
  },
  
  getSelectedChildIndex: function() {
    var index;
    if (this._selectedChild) {
      index = this.getChildIndex(this._selectedChild);
    }
    
    return index;
  },
  
  setSelectedChildIndex: function(value) {
    var child = this.getChildAt(value);
    this.setSelectedChild(child);
  },
  
  setSelected: function(value) {
    if (value != this._selected) {
      this._selected = value;
      this.trigger(new SPITFIRE.StateEvent(SPITFIRE.StateEvent.STATE_CHANGE));
    }
  },
  
  getIndex: function() {
    return this.getParent().getChildIndex(this);
  },
  
  getStateLocation: function() {
    var locationArray = [],
        state = this,
        location = '',
        i, len, inlineState;
    
    while (state) {
      locationArray.push(state);
      state = state.getParent();
    }
    
    locationArray.reverse();
    
    for (i = 0, len = locationArray.length; i < len; i+=1) {
      inlineState = locationArray[i];
      location += inlineState.getName();
      if (inlineState != locationArray[len - 1]) {
        location += '/';
      }
    }
    
    return location;
  },
  
  //--------------------------------------
  // Event Handlers
  //--------------------------------------
  
  childChangeHandler: function(event) {
    var child = event.getTarget();
    if (child.getSelected()) {
      this._selectedChild = child;
    } else
    if (child == this._selectedChild) {
      this._selectedChild = undefined;
    }
    
    this.trigger(new SPITFIRE.StateEvent(SPITFIRE.StateEvent.CHILD_STATE_CHANGE));
  },
  
  //--------------------------------------
  // Methods
  //--------------------------------------
  
  addChild: function(child) {
    child.setParent(this);
    child.setStateManager(this.getStateManager());
    child.setRoot(this._root);
    child.setDebug(this._debug);
    this._children.push(child);
    child.bind(SPITFIRE.StateEvent.STATE_CHANGE, this.childChangeHandler.context(this));
  },
  
  addChildAt: function(child, index) {
    child.setParent(this);
    child.setStateManager(this.getStateManager());
    child.setRoot(this._root);
    this._children.splice(index, 0, child);
    child.bind(SPITFIRE.StateEvent.STATE_CHANGE, this.childChangeHandler.context(this));
    return child;
  },
  
  contains: function(child) {
    return this._children.indexOf(child) != -1;
  },
  
  getChildAt: function(index) {
    return this._children[index];
  },
  
  getChildByName: function(name) {
    var foundChild, i, len, child;
    for (i = 0, len = this._children.length; i < len; i+=1) {
      child = this._children[i];
      if (child.getName() == name) {
        foundChild = child;
        break;
      }
    }
    
    return foundChild;
  },
  
  getChildIndex: function(child) {
    if (!this.contains(child)) {
      throw new SPITFIRE.Error('The supplied child must be a child of the caller.');
    }
    
    return this._children.indexOf(child);
  },
  
  removeChild: function(child) {
    if (!this.contains(child)) {
      throw new SPITFIRE.Error('The supplied child must be a child of the caller.');
    }
    
    var index = this.getChildIndex(child),
        child;
        
    if (index != -1) {
      child = this.removeChildAt(index);
    }
    
    return child;
  },
  
  removeChildAt: function(index) {
    var child = this.getChildAt(index);
    child.unbind(SPITFIRE.StateEvent.STATE_CHANGE, this.childChangeHandler.context(this));
    this._children.splice(index, 1);
    return child;
  },
  
  setChildIndex: function(child, index) {
    if (!this.contains(child)) {
      throw new SPITFIRE.Error('The supplied child must be a child of the caller.');
    }
    
    var childIndex = this.getChildIndex(child);
    this._children.splice(index, 0, this._children[childIndex]);
    this._children.splice(childIndex, 1);
  },
  
  swapChildrenAt: function(index1, index2) {
    var temp = this._children[index1];
    this._children[index1] = this._children[index2];
    this._children[index2] = temp;
  },
  
  setSelectedChildByName: function(name) {
    var foundChild, i, len, child;
    for (i = 0, len = this._children.length; i < len; i+=1) {
      child = this._children[i];
      if (child.getName() == name) {
        foundChild = child;
        break;
      }
    }
    
    if (foundChild) {
      this.setSelectedChild(foundChild);
    } else {
      throw new SPITFIRE.Error('The supplied child must be a child of the caller.');
    }
  },
  
  browse: function() {
    var location = this.getStateLocation() + this.findDefaultStates();
    this.stateManager().setLocation(location);
  },
  
  findDefaultStates: function() {
    var states = [];
    var defaultState = this.getChildByName(this.getDefaultChild());
    
    while (defaultState) {
      states.push(defaultState);
      defaultState = defaultState.getChildByName(defaultState.getDefaultChild());
    }
    
    var location = '',
        i, len;
    for (i = 0, len = states.length; i < len; i += 1) {
      if (i === 0) {
	location += '/';
      }
      
      var state = states[i];
      location += state.getName();
      
      if (i < states.length - 1) {
	location += '/';
      }
    }
    
    return location;
  },
  
  browsePreviousSibling: function() {
    var previousIndex = this.index - 1;
    if (previousIndex < 0) {
      previousIndex = this.getParent().getChildren().length - 1;
    }
    
    this.getParent().getChildAt(previousIndex).browse();
  },
  
  browseNextSibling: function() {
    var nextIndex = index + 1;
    
    if (nextIndex > this.getParent().getChildren().length - 1) {
      nextIndex = 0;
    }
    
    this.getParent().getChildAt(nextIndex).browse();
  },
  
  browsePreviousChild: function() {
    var previousIndex = this.getSelectedChildIndex() - 1;
    
    if (previousIndex < 0) {
      previousIndex = this._children.length - 1;
    }
    
    this.getChildAt(previousIndex).browse();
  },
  
  browseNextChild: function() {
    var nextIndex = this.getSelectedChildIndex() + 1;
    
    if (nextIndex > this._children.length - 1) {
      nextIndex = 0;
    }
    
    this.getChildAt(nextIndex).browse();
  },
  
  getChildFromPath: function(path) {
    var state = this,
        i, len;
    if (path.length > 0) {
      var names = path.split('/');
      for (i = 0, len = names.length; i < len; i+=1) {
        state = state.getChildByName(names[i]);
      }
    }
    
    return state;
  },
  
  createChildByName: function(value) {
    
    if (!this.childClass()) {
      throw new SPITFIRE.Error(this + ': no child class defined');
    }
    
    var state = new this._childClass();
    state.setName(value);
    this.addChild(state);
    return state;
  },
  
  toString: function() {
    return '[State' + ' name=' + this.getName() + ' title=' + this.getTitle() + ' className=' + this.getQualifiedClassName() + ' defaultChild=' + this.getDefaultChild()  + ']';
  }
};

SPITFIRE.Class(SPITFIRE.State);