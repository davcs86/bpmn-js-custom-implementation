// get bpmn-js

var BpmnViewer = require('bpmn-js/lib/Viewer');

// load additional modules
var additionalModules = [
  require('diagram-js/lib/navigation/movecanvas'),
  require('diagram-js/lib/navigation/zoomscroll')
];

//var pemworkModdleDescriptor = require('./descriptor/pemwork');

// add additional (default!) modules to bpmn-js
BpmnViewer.prototype._modules = BpmnViewer.prototype._modules.concat(additionalModules);
//BpmnModeler.prototype._extensions.pemwork = pemworkModdleDescriptor;

// export
module.exports = BpmnViewer;
