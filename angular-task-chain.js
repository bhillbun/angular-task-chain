(function () {
    'use strict';

    angular

        .module("taskChain", [])

        .factory('TaskChain', ['$q', function ($q) {
            return function () {
                var self = this;
                var defer = $q.defer();
                self.queue = [];
                self.isRunning = false;

                self.enqueue = function (task) {
                    if (angular.isFunction(task.func))
                        self.queue.push(task);
                };

                self.dequeue = function () {
                    return self.queue.pop();
                };

                self.execute = function () {
                    var task = self.dequeue();
                    if (task === undefined) {
                        self.isRunning = false;
                        return $q.when(defer.resolve(), function () {
                            defer = $q.defer();
                        });
                    }

                    self.isRunning = true;

                    task.func.apply(task.func, task.args).then(function () {
                        return self.execute();
                    }, function () {
                        self.isRunning = false;
                        return defer.reject();
                    })

                    return defer.promise;
                };
            };
        }]);
})();
