angular.module('App.directives')
    .directive('someDirective', function () {
        return{
            templateUrl: '/src/templates/directives/some_directive.html'
        }
    });