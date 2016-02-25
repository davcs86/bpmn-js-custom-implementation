(function() {
    "use strict";
    angular
      .module('custom-bpmnjs')
      .controller('ModelerController', ModelerController);

    ModelerController.$inject = ['$rootScope', '$translate', '$log'];

    function ModelerController($rootScope, $translate, $log) {
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

      vm.modeler.createDiagram(function(err, diagram){
        vm.modeler.get('i18n').addResourceBundle('es-MX', 'translation', {
          'Remove': 'Eliminar',
          'Activate the hand tool': 'Activar herramienta mano'
        });
        vm.modeler.get('i18n').changeLanguage('es-MX');
      });

      vm.btn = function () {
        console.log(vm.modeler.get('i18n').t('Hola')); //
      };

      $rootScope.$on('$translateChangeEnd', function(event, newLang) {
        $log.log(newLang.language);
        vm.modeler.get('i18n').changeLanguage(newLang.language);
      });
    }
  }
)();