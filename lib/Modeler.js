// get bpmn-js
var BpmnModeler = require('bpmn-js/lib/Modeler');

// load additional modules
var additionalModules = [
  require('bpmn-js-properties-panel/lib'),
  require('./provider/pemwork')
];

//var pemworkModdleDescriptor = require('./descriptor/pemwork');

// add additional (default!) modules to bpmn-js
BpmnModeler.prototype._modules = BpmnModeler.prototype._modules.concat(additionalModules);
//BpmnModeler.prototype._extensions.pemwork = pemworkModdleDescriptor;

// export
module.exports = BpmnModeler;
