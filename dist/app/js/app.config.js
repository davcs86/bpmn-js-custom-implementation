(function() {
  'use strict';
  angular.module('app.config', [])
    .factory('appConfig', appConfig);

  function appConfig() {
    return {
      brand: window.APP_BASEURL+'Content/images/pemex.png',
      brandmini: window.APP_BASEURL+'Content/images/pemex-mini.png',
      baseUrl: window.APP_BASEURL,
      visibleLoader: true
    };
  }
})();
