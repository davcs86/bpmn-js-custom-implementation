var BpmnModeler = require('bpmn-js/lib/Modeler'),
    // load additional modules
    additionalModules = [
        require('./panel'),
        require('diagram-js/lib/i18n'),
        require('bpmn-js-i18next'),
        require('./translate')
      ],
    additionalModdleExtensions = {
      pemwork: require('./descriptor/pemwork'),
      bonita: require('./descriptor/bonita'),
      camunda: require('camunda-bpmn-moddle/resources/camunda.json')
    };

// add additional (default!) modules to bpmn-js
BpmnModeler.prototype._modules = BpmnModeler.prototype._modules.concat(additionalModules);
BpmnModeler.prototype._moddleExtensions = additionalModdleExtensions;

// export
module.exports = BpmnModeler;
