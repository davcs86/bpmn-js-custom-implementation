(function() {
    "use strict";
    angular
      .module('custom-bpmnjs', [
        // Angular modules
        /*'ngAnimate',
         'ngAria',
         'ngMessages', */
        // 3rd Party Modules
        'ui.router',
        'ui.bootstrap',
        // app modules
        'app.config',
        'app.routes',
        'app.i18n'
      ])
      .controller('AppController', AppController);

    AppController.$inject = ['$rootScope'];

    function AppController(){
      var vm = this;
      vm.fff = "kkkk";
    }
  }
)();