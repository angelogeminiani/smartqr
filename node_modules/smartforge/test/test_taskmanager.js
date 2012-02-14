var tasks = require('../lib/module_taskmanager/taskmanager.js'),
    taskmanager = new tasks.TaskManager()
    ;

// listen standard event
taskmanager.on('run', function(tm, task){
    console.log('"run" FROM TASK MANAGER: ' + task.name);
});

// listen custom event
taskmanager.on('custom_event', function(task){
    console.log('"custom_event" from TASK MANAGER: ' + task.name);
});

// new task
var task = new tasks.Task();
task.func = function(tm){
    console.log(task._count);
    // emit custom event
    task.emit('custom_event', task);
    tm.emit('custom_event', task);

    if(task._count===10){
        // exit main process and terminate
        process.exit(0);
    }
};
task.repeat = 10;

// listen events of task
task.on('run', function(tm, task){
    console.log('"run" FROM TASK: ' + task.name);
});
// listen events of task
task.on('custom_event', function(task){
    console.log('"custom_event" FROM TASK: ' + task.name);
});

// add task
taskmanager.add(task);