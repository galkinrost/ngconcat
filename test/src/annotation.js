angular.module('App.directives')
    .directive('someDirective', ['$rootScope', '$http', function ($rootScope, $http) {
        return{
            templateUrl: '/src/templates/directives/some_directive.html'
        }
    }]);

angular.module('App', ['ngRoute']).config(['$routeProvide', function ($routeProvider) {
    $routeProvider
        .when('/Book/:bookId', {
            templateUrl: 'book.html',
            controller: 'BookController',
            resolve: {
                // I will cause a 1 second delay
                delay: function ($q, $timeout) {
                    var delay = $q.defer();
                    $timeout(delay.resolve, 1000);
                    return delay.promise;
                }
            }
        })
}]);