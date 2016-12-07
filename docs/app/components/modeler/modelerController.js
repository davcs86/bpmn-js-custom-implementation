(function() {
    "use strict";
    angular
      .module('custom-bpmnjs')
      .controller('ModelerController', ModelerController);

    ModelerController.$inject = ['modelerFactory', '$state', '$rootScope', '$log'];

    function ModelerController(modelerFactory, $state, $rootScope, $log) {
      var vm = this;
      $rootScope.$on("context-menu:click", function(event, key, options, elementId){
        if (vm) {
          $log.log(key);
          $log.log(options);
          $log.log(elementId);
          alert(key + " clicked in the modeler on the element #" + elementId);

          // get the bpmn modeler instance
          var bpmnModeler = modelerFactory.get();

          // get the element registry
          var elementRegistry = bpmnModeler.get('elementRegistry');
          // get the element by id, with the element registry
          var element = elementRegistry.get(elementId);

          // get the command stack
          var commandStack = bpmnModeler.get('commandStack');
          // append the 'elements.delete' action to the stack
          commandStack.execute('elements.delete', {
            elements: [element]
          });

        }
      });
      vm.provider = modelerFactory.getCurrentProviderName();
      vm.providers = modelerFactory.getProviders();
      vm.changePanelProvider = function(newProvider){
        modelerFactory.changeProvider(newProvider);
        vm.provider = modelerFactory.getCurrentProviderName();
      };
      vm.save = function() {
        modelerFactory.save(true);
      };
      vm.saveAndPreview = function() {
        vm.save();
        $state.go('viewer');
      };
    }
  }
)();