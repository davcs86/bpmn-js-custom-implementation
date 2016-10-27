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
    .constant('PropertiesProviders', window.BpmnJSCustom.PropertiesProviders)
    .constant('ContextMenu', window.$.contextMenu);
})();