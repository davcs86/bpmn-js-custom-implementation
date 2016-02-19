// get bpmn-js

var BpmnViewer = require('bpmn-js/lib/Viewer'),
  // load additional modules
  additionalModules = [
    require('diagram-js/lib/navigation/movecanvas'),
    require('diagram-js/lib/navigation/zoomscroll')
  ],
  additionalModdleExtensions = {
    pemwork : require('./descriptor/pemwork')
  };

// add additional (default!) modules to bpmn-js
BpmnViewer.prototype._modules = BpmnViewer.prototype._modules.concat(additionalModules);
BpmnViewer.prototype._moddleExtensions = additionalModdleExtensions;

// export
module.exports = BpmnViewer;
