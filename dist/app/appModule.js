(function() {
  "use strict";
  angular
    .module('custom-bpmnjs', [
      // Angular modules
      'ngAnimate',
      'ngAria',
      'ngMessages',
      // 3rd Party Modules
      'ui.router',
      'ui.bootstrap',
      'ngStorage',
      'pascalprecht.translate',
      'toaster'
    ])
    .constant('Modeler', window.BpmnJSCustom.Modeler)
    .constant('Viewer', window.BpmnJSCustom.Viewer)
    .constant('PropertiesPanel', window.BpmnJSCustom.PropertiesPanel)
    .constant('bpmnProvider', window.BpmnJSCustom.bpmnProvider)
    .constant('camundaProvider', window.BpmnJSCustom.camundaProvider)
    .constant('customProvider', window.BpmnJSCustom.customProvider);
})();