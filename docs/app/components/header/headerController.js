(function () {
  "use strict";
  angular
    .module('custom-bpmnjs')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$rootScope', '$state', '$translate', '$timeout', 'ContextMenu'];

  function HeaderController($rootScope, $state, $translate, $timeout, ContextMenu) {
    var vm = this;
    ContextMenu({
      selector: '.djs-group',
      callback: function(key, options) {
        var clickedElementId = this.context.childNodes[0].attributes['data-element-id'].nodeValue;
        $rootScope.$emit('context-menu:click', key, options, clickedElementId);
      },
      items: {
        "delete": {name: "Delete", icon: "fa-delete"}
      }
    });
    vm.spinnerVisible = false;
    $rootScope.$on('spinnerChanged', function(evt, newValue) {
      // spinner visibility
      $timeout(function() {
        // trigger digest
        vm.spinnerVisible = newValue;
      });
    });

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

