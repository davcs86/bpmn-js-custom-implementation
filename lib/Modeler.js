var BpmnModeler = require('bpmn-js/lib/Modeler'),
    // load additional modules
    additionalModules = [
      require('diagram-js/lib/navigation/movecanvas'),
      require('diagram-js/lib/navigation/zoomscroll'),
      require('bpmn-js-properties-panel')
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
