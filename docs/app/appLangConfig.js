(function () {
  'use strict';
  angular
    .module('custom-bpmnjs')
    .config(function ($translateProvider) {
      $translateProvider.useStaticFilesLoader({
        prefix: 'app/i18n/',
        suffix: '.json'
      });
      $translateProvider.preferredLanguage('es-MX');
    });
})();

