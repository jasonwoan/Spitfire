SPITFIRE.state = SPITFIRE.state || {};

//--------------------------------------
// SPITFIRE.state.State
//--------------------------------------

SPITFIRE.state.State = function(name) {
  this.callSuper();
  this.name(name);
  this._children = [];
  this.qualifiedClassName('SPITFIRE.state.State');
};

SPITFIRE.state.State.superclass = SPITFIRE.events.EventDispatcher;
SPITFIRE.state.State.synthesizedProperties = [
  'root',
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

SPITFIRE.state.State.prototype = {
  //--------------------------------------
  // Getters / Setters
  //--------------------------------------
  
  setRoot: function(value) {
    this._root = value;
    for (var i = 0, len = this.children().length; i < len; i+=1) {
      this.children()[i].root(this.root());
    }
  },
  
  setStateManager: function(value) {
    this._stateManager = value;
    for (var i = 0, len = this.children().length; i < len; i+=1) {
      this.children()[i].stateManager(this.stateManager());
    }
  },
  
  setChildren: function(value) {
    for (var i = 0, len = this.children().length; i < len; i+=1) {
      this.removeChild(this.children()[i]);
    }
    
    this.children() = [];
    
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
    for (i = 0, len = this.children().length; i < len; i+=1) {
      child = this.children()[i];
      if (child.activated) {
        state = child;
        break;
      }
    }
    return state;
  },
  
  getNumChildren: function() {
    return this.children().length;
  },
  
  getSelectedChildIndex: function() {
    var index;
    if (this.selectedChild()) {
      index = this.getChildIndex(this.selectedChild());
    }
    
    return index;
  },
  
  setSelectedChildIndex: function(value) {
    var child = this.getChildAt(value);
    this.selectedChild(child);
  },
  
  setSelected: function(value) {
    if (value != this.selected()) {
      this._selected = value;
      this.dispatchEvent(new SPITFIRE.events.StateEvent(SPITFIRE.events.StateEvent.STATE_CHANGE));
    }
  },
  
  getIndex: function() {
    return this.parent().getChildIndex(this);
  },
  
  getStateLocation: function() {
    var locationArray = [],
        state = this,
        location = '',
        i, len, inlineState;
    
    while (state) {
      locationArray.push(state);
      state = state.parent();
    }
    
    locationArray.reverse();
    
    for (i = 0, len = locationArray.length; i < len; i+=1) {
      inlineState = locationArray[i];
      location += inlineState.name();
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
    var child = event.target();
    if (child.selected()) {
      this._selectedChild = child;
    } else
    if (child == this._selectedChild) {
      this._selectedChild = undefined;
    }
    
    this.dispatchEvent(new SPITFIRE.events.StateEvent(SPITFIRE.events.StateEvent.CHILD_STATE_CHANGE));
  },
  
  //--------------------------------------
  // Methods
  //--------------------------------------
  
  addChild: function(child) {
    child.parent(this);
    child.stateManager(this.stateManager());
    child.root(this.root());
    this.children().push(child);
    child.addEventListener(SPITFIRE.events.StateEvent.STATE_CHANGE, this.childChangeHandler.context(this));
  },
  
  addChildAt: function(child, index) {
    child.parent(this);
    child.stateManager(this.stateManager());
    child.root(this.root());
    this.children().splice(index, 0, child);
    child.addEventListener(SPITFIRE.events.StateEvent.STATE_CHANGE, this.childChangeHandler.context(this));
    return child;
  },
  
  contains: function(child) {
    return this.children().indexOf(child) != -1;
  },
  
  getChildAt: function(index) {
    return this.children()[index];
  },
  
  getChildByName: function(name) {
    var foundChild, i, len, child;
    for (i = 0, len = this.children().length; i < len; i+=1) {
      child = this.children()[i];
      if (child.name() == name) {
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
    
    return this.children().indexOf(child);
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
    child.removeEventListener(SPITFIRE.events.StateEvent.STATE_CHANGE, this.childChangeHandler.context(this));
    this.children().splice(index, 1);
    return child;
  },
  
  setChildIndex: function(child, index) {
    if (!this.contains(child)) {
      throw new SPITFIRE.Error('The supplied child must be a child of the caller.');
    }
    
    var childIndex = this.getChildIndex(child);
    this.children().splice(index, 0, this.children()[childIndex]);
    this.children().splice(childIndex, 1);
  },
  
  swapChildrenAt: function(index1, index2) {
    var temp = this.children()[index1];
    this.children()[index1] = this.children()[index2];
    this.children()[index2] = temp;
  },
  
  setSelectedChildByName: function(name) {
    var foundChild, i, len, child;
    for (i = 0, len = this.children().length; i < len; i+=1) {
      child = this.children()[i];
      if (child.name() == name) {
        foundChild = child;
        break;
      }
    }
    
    if (foundChild) {
      this.selectedChild(foundChild);
    } else {
      throw new SPITFIRE.Error('The supplied child must be a child of the caller.');
    }
  },
  
  browse: function() {
    this.stateManager().location(this.stateLocation());
  },
  
  browsePreviousSibling: function() {
    var previousIndex = this.index - 1;
    if (previousIndex < 0) {
      previousIndex = this.parent().children().length - 1;
    }
    
    this.parent().getChildAt(previousIndex).browse();
  },
  
  browseNextSibling: function() {
    var nextIndex = index + 1;
    
    if (nextIndex > this.parent().children().length - 1) {
      nextIndex = 0;
    }
    
    this.parent().getChildAt(nextIndex).browse();
  },
  
  browsePreviousChild: function() {
    var previousIndex = this.selectedChildIndex() - 1;
    
    if (previousIndex < 0) {
      previousIndex = this.children().length - 1;
    }
    
    this.getChildAt(previousIndex).browse();
  },
  
  browseNextChild: function() {
    var nextIndex = this.selectedChildIndex() + 1;
    
    if (nextIndex > this.children().length - 1) {
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
    
    var state = new this.childClass();
		state.name(value);
		this.addChild(state);
		return state;
  },
  
  toString: function() {
    return '[State' + ' name=' + this.name() + ' title=' + this.title() + ' className=' + this.qualifiedClassName() + ' defaultChild=' + this.defaultChild()  + ']';
  }
};

SPITFIRE.Class(SPITFIRE.state.State);