(function() {
    "use strict";
    angular
      .module('custom-bpmnjs')
      .controller('ViewerController', ViewerController);

    ViewerController.$inject = ['$rootScope', '$log', 'viewerFactory'];

    function ViewerController($rootScope, $log, viewerFactory){
      var vm = this;

    }
  }
)();
