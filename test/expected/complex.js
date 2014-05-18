angular.module('App.services', []);
angular.module('App.services')
    .factory('FirstService', function () {
        return {};
    });
angular.module('SomeModule.services', []);
angular.module('SomeModule.services')
    .factory('SomeModuleFirstService', function () {
        return {};
    });
angular.module('SomeModule.directives', []);
angular.module('SomeModule.directives')
    .factory('someModuleFirstDirective', function () {
        return {};
    });
angular.module('SomeModule.controllers', []);
angular.module('SomeModule.controllers')
    .controller('SomeModuleSecondCtrl', function ($scope) {
    });
angular.module('SomeModule.controllers')
    .controller('SomeModuleFirstCtrl', function ($scope) {
    });
angular.module('App.directives', []);
angular.module('App.directives')
    .factory('firstDirective', function () {
        return {};
    });
angular.module('App.controllers', []);
angular.module('App.controllers')
    .controller('SecondCtrl', function ($scope) {
    });
angular.module('App.controllers')
    .controller('FirstCtrl', function ($scope) {
    });
angular.module('SomeModule', ['SomeModule.controllers', 'SomeModule.services', 'SomeModule.directives']);
angular.module('App', ['App.controllers', 'App.services', 'App.directives', 'SomeModule']);
