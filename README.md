# angular-task-chain

Angular 1.2+ compatible module for serializing a series of functions returning promises to be executed later, in order, and to stop upon failure.  This is useful when you need a promise method, upon success, to execute another such as when using loops.  This also makes a great way to make a series of asynchronous methods execute synchronously.



## Usage

Reference the script:

``` html
<script src="angular-task-chain.min.js"></script>
```

Specify the module as a dependency of your application:

``` js
var app = angular.module('sampleApp', ['taskChain']);
```

Now just inject the TaskChain into any controller or service needed and instance it:

``` js
app.controller('SampleController', ['$scope', '$q', 'TaskChain', function($scope, $q, TaskChain) {
    var tasks = new TaskChain();

    $scope.saveItem = function(item, state) {
        var task = {
            args: [item, state],
            func: function(item, state) {
                var defer = $q.defer();

                // some code to save here that will resolve() / reject()

                return defer.promise();
            }
        }

        tasks.enqueue(task);
    }

    $scope.applyChanges = function() {
        tasks.execute().then(function() {
            // All tasks completed successfully... 
        }).catch(function() {
            // A task has failed, execution halted.
            // If execute() is called again, will begin where it left off.
        }
    }
});
```

The `enqueue()` method requires a json object as a parameter.  This allows the use of arguments with the function.  

You can also use the `dequeue()` method to pop the queue if you wish to execute the task manually.

##### enqueue options

The `enqueue` function takes an object with these fields:
* `task.args` - an array of arguments to be passed to the function
* `task.func` - a factory function to contain a deferred function that will return a valid promise
 