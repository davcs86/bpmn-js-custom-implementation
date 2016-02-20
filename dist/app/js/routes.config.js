(function () {
  'use strict';

  angular.module('app.routes', [])
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
              templateUrl: 'parts/' + route + '.html'
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
        .when('/', '/viewer')
        .otherwise('/viewer');
    }]);
})();