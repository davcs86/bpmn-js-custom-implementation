(function() {
    "use strict";
    angular
      .module('custom-bpmnjs')
      .controller('ModelerController', ModelerController);

    ModelerController.$inject = ['$rootScope', 'appFactory', '$translate', '$log'];

    function ModelerController($rootScope, appFactory, $translate, $log) {
      var vm = this;
      $log.log(appFactory);
      $rootScope.$on('modelUpdated', function (evt, newModel) {
        vm.modeler.importXML(diagram, function (err) {
          if (err) {
            return $log.error('Could not import BPMN 2.0 XML', err);
          }
          // save the new model in the localstorage

        });
      });

      vm.btn = function () {
        console.log(vm.modeler.get('i18n').t('Hola')); //
      };
      $rootScope.$on('$translateChangeEnd', function(event, newLang) {
        $log.log(newLang.language);
        vm.modeler.get('i18n').changeLanguage(newLang.language);
      });
      // create the modeler
      vm.modeler = new BpmnJSCustom.Modeler({
        container: '#modeler-canvas',
        propertiesPanel: {
          parent: '#modeler-properties-panel'
        },
        additionalModules: [
          BpmnJSCustom.customProvider
        ]
      });
      // load the languages
      // set the language
      // initialize the diagram
      vm.modeler.createDiagram(function(err, diagram){
        vm.modeler.get('i18n').addResourceBundle('es-MX', 'translation', {
          'Remove': 'Eliminar',
          'Activate the hand tool': 'Activar herramienta mano'
        });
        vm.modeler.get('i18n').changeLanguage('es-MX');
      });
    }
  }
)();