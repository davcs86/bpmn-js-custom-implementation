'use strict';

var inherits = require('inherits'),
    BaseBpmnModeler = require('bpmn-js/lib/Modeler'),
    // load additional modules
    additionalModules = [
        require('./panel'),
        require('diagram-js/lib/i18n'),
        require('bpmn-js-i18next'),
        require('./translate'),
        require('./context-pad'),
        require('./palette'),
      require('./popup-menu'),//,
      require('./replace')
        // Descomentar en producción, comentar en desarrollo
      //  require('./provider/pemwork')
      ],
    additionalModdleExtensions = {
      pemwork: require('./descriptor/pemwork'),
      bonita: require('./descriptor/bonita'),
      camunda: require('camunda-bpmn-moddle/resources/camunda.json')
    };

function BpmnModeler(options){
  BaseBpmnModeler.call(this, options);
}

inherits(BpmnModeler, BaseBpmnModeler);

// add additional (default!) modules to bpmn-js
BpmnModeler.prototype._modules = BpmnModeler.prototype._modules.concat(additionalModules);
BpmnModeler.prototype._moddleExtensions = additionalModdleExtensions;

BpmnModeler.prototype.importXML = function (xml, done){
  // fix for bonitaBPM
  var re = /<[^:]+:participant id="([^"]+)" name="[^"]+" processRef="([^"]+)"[ ]?\/>/gmi,
      matches = re.exec(xml),
      re2;
  while (matches){
    re2 = new RegExp(":BPMNShape id=\"([^\"]+)\" bpmnElement=\"" + matches[2].replace('-', '\-') + "\"", "gmi");
    xml = xml.replace(re2, ":BPMNShape id=\"$1\" bpmnElement=\""+matches[1]+"\"");
    matches = re.exec(xml, matches);
  }

  this.constructor.super_.super_.prototype.importXML.call(this, xml, done);
};

// export
module.exports = BpmnModeler;
