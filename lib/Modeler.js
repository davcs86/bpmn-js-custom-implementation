var BpmnModeler = require('bpmn-js/lib/Modeler'),
    translateModule = require('../../bpmn-js-i18next');

// also available thru
//translateModule.translate[1].prototype.setOptions
translateModule[translateModule.__init__[0]][1].prototype.setOptions = function(i18next) {
  "use strict";
  var resources = {
    es: {
      translation: {
        'Create {what}': 'Insertar {{what}}'
      }
    },
    en: {
      "translation": {
        'Create {what}': 'Create {{what}}'
      }
    }
  };
  i18next.init({
    lng: 'es',
    resources: resources,
    fallbackLng : 'en'
  }, function (err, t) {
    console.log(arguments);
    console.log('i18next');
  });
};

// load additional modules
var additionalModules = [
      require('diagram-js/lib/navigation/movecanvas'),
      require('diagram-js/lib/navigation/zoomscroll'),
      require('bpmn-js-properties-panel'),
      translateModule
    ],
  additionalModdleExtensions = {
    pemwork: require('./descriptor/pemwork'),
    camunda: require('./../node_modules/camunda-bpmn-moddle/resources/camunda.json')
  };

// add additional (default!) modules to bpmn-js
BpmnModeler.prototype._modules = BpmnModeler.prototype._modules.concat(additionalModules);
BpmnModeler.prototype._moddleExtensions = additionalModdleExtensions;

// export
module.exports = BpmnModeler;
