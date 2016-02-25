(function() {
    "use strict";
    angular
      .module('custom-bpmnjs')
      .controller('ViewerController', ViewerController);

    ViewerController.$inject = ['$rootScope', '$log'];

    function ViewerController($rootScope, $log){
      var vm = this;
      $rootScope.$on('modelUpdated', function(evt, newModel){
        vm.model = newModel;
        vm.viewer.importXML(diagram, function (err) {
          if (err) {
            return $log.error('Could not import BPMN 2.0 XML', err);
          }
        });
      });
      // create the viewer
      vm.viewer = new BpmnJSCustom.Viewer({
        container: '#viewer-canvas',
        propertiesPanel: {
          parent: '#viewer-properties-panel'
        }
      });
      //vm.viewer.createDiagram($.noop);
    }
  }
)();