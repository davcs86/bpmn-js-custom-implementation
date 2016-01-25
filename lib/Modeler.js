// get bpmn-js
var BpmnModeler = require('bpmn-js/lib/Modeler');

// load additional modules
var additionalModules = [
  require('diagram-js/lib/navigation/movecanvas'),
  require('diagram-js/lib/navigation/zoomscroll'),
  require('bpmn-js-properties-panel/lib'),
  require('bpmn-js-properties-panel/lib/provider/pemwork')
];

// add additional (default!) modules to bpmn-js
BpmnModeler.prototype._modules = BpmnModeler.prototype._modules.concat(additionalModules);

// export
module.exports = BpmnModeler;
