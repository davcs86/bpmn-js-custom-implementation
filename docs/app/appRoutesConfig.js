(function () {
  'use strict';
   angular.module('custom-bpmnjs')
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
      var routes = [
        'modeler',
        'viewer'
      ];
      var setRoutes = function (route) {
        var config = {
          url: '/' + route,
          views: {
            'maincontent@': {
              templateUrl: 'app/components/' + route + '/' + route + 'View.html'
            }
          }
        };
        $stateProvider.state(route, config);
        return $stateProvider;
      };

      routes.forEach(function (route) {
        return setRoutes(route);
      });

      $urlRouterProvider
        .when('/', '/modeler')
        .otherwise('/modeler');
    }]);
})();