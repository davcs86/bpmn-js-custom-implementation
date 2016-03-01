(function () {
  "use strict";
  angular
    .module('custom-bpmnjs')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$rootScope', '$state', '$translate', '$timeout'];

  function HeaderController($rootScope, $state, $translate, $timeout) {
    var vm = this;
    vm.spinnerVisible = false;
    $rootScope.$on('spinnerChanged', function(evt, newValue) {
      // spinner visibility
      $timeout(function() {
        // trigger digest
        vm.spinnerVisible = newValue;
      });
    });


    // navbar active class
    //vm.isActive = function(query){
    //  return (query === $state.current.name);
    //}

    // lang dropdown
    vm.lang = 'Español';
    vm.status = {};
    vm.setLang = function (lang) {
      switch (lang) {
        case 'English':
          $translate.use('en-US');
          break;
        case 'Español':
          $translate.use('es-MX');
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
  }
})();

