// get bpmn-js
var BpmnModeler = require('bpmn-js/lib/Modeler'),
    // load additional modules
    additionalModules = [
      require('bpmn-js-properties-panel/lib'),
      require('./provider/pemwork')
    ],
  moddleExtensions = {
    pemwork: require('./descriptor/pemwork.json'),
    camunda: require('./../../camunda-bpmn-moddle/resources/camunda.json')
  };

// add additional (default!) modules to bpmn-js
BpmnModeler.prototype._modules = BpmnModeler.prototype._modules.concat(additionalModules);
BpmnModeler.prototype._moddleExtensions = moddleExtensions;

// export
module.exports = BpmnModeler;
