/*!
 * SmartForge - taskmanager
 * Copyright(c) 2011 Gian Angelo Geminiani
 * MIT Licensed
 *
 * Task Manager
 *
 * Example:
 *
 *  var tm = require('./lib/taskmanager/taskmanager.js'),
 *  taskmanager = tm.newInstance();
 *
 *  // listen standard event
 *  taskmanager.on('run', function(tm, task){
 *      console.log('RUN: ' + task.name);
 *  });
 *
 *  // listen custom event
 *  taskmanager.on('custom_event', function(task){
 *      console.log('EVENT: "custom_event" from' + task.name);
 *  });
 *
 *  // new task
 *  var task = taskmanager.createTask();
 *  task.func = function(tm){
 *      console.log(task._count);
 *      // emit custom event
 *      tm.emit('custom_event', task);
 *
 *      if(task._count===10){
 *          // exit main process and terminate
 *          process.exit(0);
 *      }
 *  };
 *  task.repeat = 10;
 *
 *  // add task
 *  taskmanager.add(task);
 */

/**
 * Module dependencies
 *
 */
var utils = require('../utils.js');

var SYS_DELAY = 0;

// --------------------------------------------------------------------------------------------------------------
//                              public
// --------------------------------------------------------------------------------------------------------------

function TaskManager() {
    var self = this;
    //-- CONSTANTS --//
    self.EVENT_RUN = "run";
    //-- variables --//
    self._tasks = new Array();
    self._counter = 0;
    self._working = false;
    self._processId = setInterval(function(){
        run(self);
    }, SYS_DELAY);
}
// inherit from EventEmitter
utils.inheritsEventEmitter(TaskManager);

TaskManager.prototype.add = function (task) {
    this._counter++;
    if (null != task && utils.isFunction(task.func)) {
        // check task name
        task.name = task.name || 'task#' + (++this._counter);
        // add task to internal array
        this._tasks.push(task);
    }
    return 0;
};

TaskManager.prototype.createTask = function () {
    return new Task();
};

TaskManager.prototype.close = function () {
    clearTimeout(this._processId);
    if (this._tasks.length > 0) {
        for (var i = this._tasks.length - 1; i > -1; i--) {
            var task = this._tasks[i];
            if (null != task._id) {
                clearTimeout(task._id);
            }
        }
        this._tasks = new Array();
    }
};

// --------------------------------------------------------------------------------------------------------------
//                              public Task
// --------------------------------------------------------------------------------------------------------------

function Task(){

}
// inherit from EventEmitter
utils.inheritsEventEmitter(Task);

Task.prototype.name = null;
Task.prototype.func = function () { };
Task.prototype.delay = 1000;
Task.prototype.repeat = -1; // infinite loop
Task.prototype.date = new Date();
Task.prototype.args = null;
Task.prototype._id = null;
Task.prototype._count = 0;


// --------------------------------------------------------------------------------------------------------------
//                              private
// --------------------------------------------------------------------------------------------------------------

function run(tm) {
    var tasks = tm._tasks;
    if(tasks){
        try {
            if (!tm._working && tasks.length > 0) {
                tm._working = true;
                for (var i = tasks.length - 1; i > -1; i--) {
                    var task = tasks[i],
                        lastShot = task.repeat === 0
                            || task.repeat === 1;
                    // remove one-shot task
                    if (lastShot) {
                        tasks.splice(i, 1);
                    }
                    utils.defer(function(){
                        runTask(tm, task);
                    });
                }
            }
        } catch (err) {

        }
        tm._working = false;
    }
}

function runTask(tm, task) {
    if (task.repeat === 0) {
        return;
    }
    if (isTimeToExecute(task)) {
        // ready for execution
        utils.defer(function(){
            execTask(tm, task);
        });
    }
}

function isTimeToExecute(task) {
    if (task.date) {
        var now = new Date();
        return now >= task.date;
    }
    return true;
}

function execTask(tm, task) {
    try {
        if(task._id){
            return;
        }
        task._id = setTimeout(function (){
            // reset id
            task._id = null;
            // inc task counter
            if (task.repeat > -1) {
                task._count++;
            }
            if(utils.isFunction(task.func)){
                //-- call function --//
                task.func.call(tm, tm, task);

                // check for next execution
                if (task._count === task.repeat) {
                    task.repeat = 0; // next time is removed and not executed
                }

                //-- events --//
                task.emit(tm.EVENT_RUN, tm, task);
                tm.emit(tm.EVENT_RUN, tm, task);
            }
        }, task.delay, task.args);
    } catch (err) {
    }
}

// --------------------------------------------------------------------------------------------------------------
//                              exports
// --------------------------------------------------------------------------------------------------------------

exports.newInstance = function newInstance(){
    return new TaskManager();
};

exports.createTask = function(){
    return new Task();
};

exports.TaskManager = TaskManager;
exports.Task = Task;
