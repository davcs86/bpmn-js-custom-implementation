(function() {
    "use strict";
    angular
      .module('custom-bpmnjs')
      .controller('ViewerController', ViewerController);

    ViewerController.$inject = ['$state', 'viewerFactory'];

    function ViewerController($state, viewerFactory){
      var vm = this;
      vm.edit = function(){
        $state.go('modeler');
      }
    }
  }
)();
