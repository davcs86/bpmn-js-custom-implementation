(function () {
  "use strict";
  angular
    .module('app.i18n', ['pascalprecht.translate'])
    .config(function ($translateProvider) {
      $translateProvider.useStaticFilesLoader({
        prefix: window.APP_BASEURL+'Content/i18n/',
        suffix: '.json'
      });
      $translateProvider.preferredLanguage('es-ES');
    })
    .controller('LangController', LangController);

  LangController.$inject = ['$rootScope', '$translate'];

  function LangController($rootScope, $translate) {
    var vm = this;
    vm.lang = 'Español';

    $rootScope.$on('$translateChangeEnd', function() {
      vm.updateViewerLang();
      vm.updateModelerLang();
    });

    vm.setLang = function (lang) {
      switch (lang) {
        case 'English':
          $translate.use('en-US');
          break;
        case 'Español':
          $translate.use('es-ES');
          break;
      }
      vm.lang = lang;
    };

    vm.getFlag = function () {
      var lang, result;
      lang = vm.lang;
      switch (lang) {
        case 'English':
          result = 'flags-american';
          break;
        case 'Español':
          result = 'flags-mexico';
          break;
        default:
          result = "";
      }
      return result;
    };
    vm.updateViewerLang = function () {
      var newLang = $translate.use();
      //TODO: Update the viewer lang
    }
    vm.updateModelerLang = function () {
      var newLang = $translate.use();
      //TODO: Update the modeler lang
    }
  }
})();

