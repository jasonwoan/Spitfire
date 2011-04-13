
// documentation on writing tests here: http://docs.jquery.com/QUnit
// example tests: https://github.com/jquery/qunit/blob/master/test/same.js

// below are some general tests but feel free to delete them.

//--------------------------------------
// HTML5 Boilerplate
//--------------------------------------

module("HTML5 Boilerplate tests");

// these test things from plugins.js
test("Environment is good",function(){
  expect(3);
  ok( !!window.log, "log function present");
  
  var history = log.history && log.history.length || 0;
  log("logging from the test suite.")
  equals( log.history.length - history, 1, "log history keeps track" )
  
  ok( !!window.Modernizr, "Modernizr global is present")
});

module("framework tests");

//--------------------------------------
// Basic inheritance
//--------------------------------------

test("Basic inheritance", function() {
  //--------------------------------------
  // Person
  //--------------------------------------
  
  Person = function(name) {
    this.callSuper();
    
    this.name(name);
    this.qualifiedClassName('Person');
  }
  
  Person.superclass = SPITFIRE.Object;
  Person.synthesizedProperties = ['name', 'weight'];
  
  Person.prototype = {
    run: function() {
      return this.name() + ' is running';
    },
    
    breathe: function() {
      return 'breathing';
    }
  }
  
  SPITFIRE.Class(Person);
  
  //--------------------------------------
  // Employee
  //--------------------------------------
  
  Employee = function(name, company) {
    this.callSuper(name);
    
    this.company(company);
  }
  
  Employee.superclass = Person;
  Employee.synthesizedProperties = ['company', 'salary', 'promotion'];
  
  Employee.prototype = {
    work: function() {
      return this.name() + ' is working';
    },
    
    setName: function(value) {
      this._name = 'Employee: ' + value;
    }
  }
  
  SPITFIRE.Class(Employee);
  
  //--------------------------------------
  // Developer
  //--------------------------------------
  
  Developer = function(name, company, job) {
    this.job(job);
    this.callSuper(name, company);
  }
  
  Developer.synthesizedProperties = ['job'];
  Developer.superclass = Employee;
  
  Developer.prototype = {
    program: function() {
      return this.name() + ' is programming';
    },
    
    setName: function(value) {
      this._name = 'Developer: ' + value;
    },
    
    work: function() {
      return this.name() + ' is working hard';
    }
  }
  
  SPITFIRE.Class(Developer);
  
  //--------------------------------------
  // Test Objects
  //--------------------------------------
  
  var person = new Person('Joe');
  var person2 = new Person('Stacey');
  var employee = new Employee('Bob', 'TCD');
  var developer = new Developer('Jason', 'TCD', 'interactive developer');
  
  //--------------------------------------
  // Assertions
  //--------------------------------------
  
  equals(person.name(), 'Joe', 'synthesized property works');
  equals(person.qualifiedClassName(), 'Person', 'qualifiedClassName works');
  equals(person.breathe(), 'breathing', 'calling a method on a object');
  equals(employee.name(), 'Employee: Bob', 'overriding a synthesized property works');
  equals(employee.promotion(), undefined, 'uninitialized synthesized property works');
  equals(developer.name(), 'Developer: Jason', 'overriding a synthesized property works (2 levels)');
  equals(developer.name(), 'Developer: Jason', 'overriding a synthesized property works (2 levels)');
  equals(developer.work(), 'Developer: Jason is working hard', 'overriding a parent method works');
  equals(QUnit.equiv(person, person2), false, '');
});

//--------------------------------------
// Error
//--------------------------------------

test("Error works", function() {
  var error = new SPITFIRE.Error('this is an error');
  
  equals(error.toString(), 'Error: [SPITFIRE.Error] "this is an error"', 'toString works');
});

//--------------------------------------
// State
//--------------------------------------

test("State works", function() {
  var state = new SPITFIRE.state.State('testState');
  var childState = new SPITFIRE.state.State('testChildState');
  var childState2 = new SPITFIRE.state.State('testChildState2');
  var childState3 = new SPITFIRE.state.State('testChildState3');
  
  state.addChild(childState);
  state.addChild(childState2);
  state.root(this);
  
  equals(state.name(), 'testState', 'name property works');
  equals(QUnit.equiv(state.root(), this), true, 'root property works');
  equals(childState.name(), 'testChildState', 'child name property works');
  equals(state.qualifiedClassName(), 'SPITFIRE.state.State', 'qualified class name works');
  equals(QUnit.equiv(state.getChildAt(0), childState), true, 'addChild and getChildAt works');
  equals(QUnit.equiv(state.getChildByName('testChildState'), childState), true, 'getChildByName works');
  
  state.selectedChild(childState);
  
  equals(QUnit.equiv(state.selectedChild(), childState), true, 'selectedChild works');
  
  state.selectedChild(childState2);
  
  equals(QUnit.equiv(state.selectedChild(), childState2), true, 'changing selectedChild works');
  equals(state.selectedChildIndex(), 1, 'selectedChildIndex works');
  equals(childState2.index(), 1, 'index works');
  equals(childState2.stateLocation(), 'testState/testChildState2', 'stateLocation works');
  
  state.addChildAt(childState3, 1);
  
  equals(QUnit.equiv(state.getChildAt(1), childState3), true, 'addChildAt works');
  ok(state.contains(childState2), 'contains works');
  equals(state.getChildIndex(childState2), 2, 'getChildIndex works');
  
  state.removeChild(childState2);
  equals(state.numChildren(), 2, 'removeChild & numChildren works');
  
  state.removeChildAt(0);
  equals(QUnit.equiv(state.getChildAt(0), childState3), true, 'removeChildAt works');
  
  raises(state.setChildIndex, SPITFIRE.Error, 'setChildIndex exception works');
});

//--------------------------------------
// Task
//--------------------------------------

test('Task works', function() {
  var task = new SPITFIRE.tasks.Task();
  task.start();
  
  equals(task.progress(), 0, 'start works');
  equals(task, '[SPITFIRE.tasks.Task name=undefined]', 'toString works');
  
  task.complete();
  
  equals(task.progress(), 1, 'completeWorks');
});

//--------------------------------------
// PropertyTask
//--------------------------------------

test('PropertyTask works', function() {
  var state = new SPITFIRE.state.State('testState');
  var propertyTask = new SPITFIRE.tasks.PropertyTask(state, 'selected', true);
  
  equals(propertyTask.toString(), '[SPITFIRE.tasks.PropertyTask target=[State name=testState title=undefined className=SPITFIRE.state.State defaultChild=undefined] property=selected value=true]', 'toString works');
  
  propertyTask.start();
  
  equals(state.selected(), true, 'start works');
});

//--------------------------------------
// TaskManager
//--------------------------------------

test('TaskManager works', function() {
  var taskManager = new SPITFIRE.tasks.TaskManager();
  var state = new SPITFIRE.state.State('testState');
  var propertyTask = new SPITFIRE.tasks.PropertyTask(state, 'selected', true);
  propertyTask.name('propertyTask');
  var propertyTask2 = new SPITFIRE.tasks.PropertyTask(state, 'selected', false);
  var propertyTask3 = new SPITFIRE.tasks.PropertyTask(state, 'selected', true);
  
  taskManager.tasks([propertyTask, propertyTask2]);
  
  equal(QUnit.equiv(taskManager.tasks()[0], propertyTask) && QUnit.equiv(taskManager.tasks()[1], propertyTask2), true, 'tasks property works');
  equal(taskManager.progress(), 0, 'progress property works');
  
  taskManager.addTaskAt(propertyTask3, 0);
  
  equal(QUnit.equiv(taskManager.tasks()[0], propertyTask3), true, 'addTaskAt property works');
  ok(taskManager.contains(propertyTask3), 'contains works');
  equal(QUnit.equiv(taskManager.getTaskAt(1), propertyTask), true, 'getTaskAt property works');
  equal(QUnit.equiv(taskManager.getTaskByName('propertyTask'), propertyTask), true, 'getTaskByName property works');
  equal(QUnit.equiv(taskManager.getTaskIndex(propertyTask), 1), true, 'getTaskIndex property works');
  
  taskManager.removeTask(propertyTask);
  
  equal(QUnit.equiv(taskManager.getTaskAt(1), propertyTask2), true, 'removeTask property works');
  
  taskManager.removeTaskAt(0);
  
  equal(QUnit.equiv(taskManager.getTaskAt(0), propertyTask2), true, 'removeTaskAt property works');
});

//--------------------------------------
// SequentialTask
//--------------------------------------

asyncTest('ASYNC: SequentialTask works', function() {
  var state = new SPITFIRE.state.State('testState');
  var propertyTask = new SPITFIRE.tasks.PropertyTask(state, 'selected', true);
  propertyTask.name('propertyTask');
  var propertyTask2 = new SPITFIRE.tasks.PropertyTask(state, 'selected', false);
  var propertyTask3 = new SPITFIRE.tasks.PropertyTask(state, 'selected', true);
  
  var sequentialTask = new SPITFIRE.tasks.SequentialTask(propertyTask, propertyTask2);
  //sequentialTask.debug(true);
  sequentialTask.start();
  
  setTimeout(function() {
    equals(state.selected(), false, 'start works');
    start();
  }, 33);
});

//--------------------------------------
// ParallelTask
//--------------------------------------

asyncTest('ASYNC: ParallelTask works', function() {
  var state = new SPITFIRE.state.State('testState');
  var propertyTask = new SPITFIRE.tasks.PropertyTask(state, 'selected', true);
  propertyTask.name('propertyTask');
  var propertyTask2 = new SPITFIRE.tasks.PropertyTask(state, 'selected', false);
  var propertyTask3 = new SPITFIRE.tasks.PropertyTask(state, 'selected', true);
  var complete = false;
  
  var parallelTask = new SPITFIRE.tasks.ParallelTask(propertyTask, propertyTask2, propertyTask3);
  //parallelTask.debug(true);
  
  parallelTask.bind(SPITFIRE.events.Event.COMPLETE, function() {
    complete = true;
  });
  
  parallelTask.start();
  
  setTimeout(function() {
    equals(complete, true, 'complete works');
    start();
  }, 100);
});

//--------------------------------------
// StateManager
//--------------------------------------

test("StateManager works", function() {
  var stateManager = new SPITFIRE.state.StateManager('testName', this);
  
  equals(stateManager.name(), 'testName', 'name property works');
  equals(stateManager.qualifiedClassName(), 'SPITFIRE.state.StateManager', 'qualified class name works');
});

asyncTest('ASYNC: StateManager works', function() {
  var stateManager = new SPITFIRE.state.StateManager('testName', this);
  //stateManager.deepLinking($.address);
  
  var treeState = new SPITFIRE.state.State('tree');
  var homeState = new SPITFIRE.state.State('home');
  var portfolioState = new SPITFIRE.state.State('portfolio');
  var aboutState = new SPITFIRE.state.State('about');
  var contactState = new SPITFIRE.state.State('contactState');
  
  treeState.addChild(homeState);
  treeState.addChild(portfolioState);
  treeState.addChild(aboutState);
  treeState.addChild(contactState);
  
  stateManager.tree(treeState);
  //stateManager.debug(true);
  aboutState.browse();
  contactState.browse();
  
  setTimeout(function() {
    equals(stateManager.location(), 'tree/contactState', 'browse and location works');
    start();
  }, 100);
});

//--------------------------------------
// JQueryAjaxTask
//--------------------------------------

asyncTest('ASYNC: JQueryAjaxTask works', function() {
  var cssTask = new SPITFIRE.tasks.JQueryAjaxTask('test.css');
  var cssData;
  var cssSuccess = false;
  cssTask.bind(SPITFIRE.events.Event.COMPLETE, function() {
    cssData = this.content();
    cssSuccess = true;
  });
  cssTask.start();
  
  var htmlTask = new SPITFIRE.tasks.JQueryAjaxTask('test.html');
  var htmlData;
  var htmlSuccess = false;
  htmlTask.bind(SPITFIRE.events.Event.COMPLETE, function() {
    htmlData = this.content();
    htmlSuccess = true;
  });
  htmlTask.start();
  
  var failTask = new SPITFIRE.tasks.JQueryAjaxTask('fail.html');
  //failTask.debug(true);
  var failSuccess = false;
  var failContent;
  failTask.bind(SPITFIRE.events.Event.COMPLETE, function() {
    failContent = this.content();
    failSuccess = true;
  });
  failTask.start();
  
  setTimeout(function() {
    equals(cssSuccess, true, 'css data loaded');
    equals(htmlSuccess, true, 'html data loaded');
    equals(failSuccess, true, 'html data loaded');
    start();
  }, 100);
});

//--------------------------------------
// JQueryImageLoaderTask
//--------------------------------------

asyncTest('ASYNC: JQueryImageLoaderTask works', function() {
  var task = new SPITFIRE.tasks.JQueryImageLoaderTask('test.png');
  var $img;
  task.bind(SPITFIRE.events.Event.COMPLETE, function() {
    $img = task.$content();
  });
  task.start();
  
  setTimeout(function() {
    notEqual($img, undefined, 'image loaded');
    start();
  }, 100);
});