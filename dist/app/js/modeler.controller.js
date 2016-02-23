(function() {
    "use strict";
    angular
      .module('custom-bpmnjs')
      .controller('ModelerController', ModelerController);

    ModelerController.$inject = ['$rootScope', '$log'];

    function ModelerController($rootScope, $log) {
      var vm = this;
      $rootScope.$on('modelUpdated', function (evt, newModel) {
        vm.model = newModel;
        vm.modeler.importXML(diagram, function (err) {
          if (err) {
            return $log.error('Could not import BPMN 2.0 XML', err);
          }
        });
      });
      // create the modeler
      vm.modeler = new BpmnJSCustom.Modeler({
        container: '#modeler-canvas',
        propertiesPanel: {
          parent: '#modeler-properties-panel'
        }
      });
      vm.modeler.createDiagram($.noop);
      vm.btn = function () {
        console.log(vm.modeler.geti18n().t()); //
      }
    }
  }
)();