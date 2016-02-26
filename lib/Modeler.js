var BpmnModeler = require('bpmn-js/lib/Modeler'),
    // load additional modules
    additionalModules = [
      require('bpmn-js-properties-panel/lib'),
      require('./provider/pemwork')
    ],
  additionalModdleExtensions = {
    pemwork: require('./descriptor/pemwork.json'),
    camunda: require('./../node_modules/camunda-bpmn-moddle/resources/camunda.json')
  };

// add additional (default!) modules to bpmn-js
BpmnModeler.prototype._modules = BpmnModeler.prototype._modules.concat(additionalModules);
BpmnModeler.prototype._moddleExtensions = additionalModdleExtensions;

// export
module.exports = BpmnModeler;
