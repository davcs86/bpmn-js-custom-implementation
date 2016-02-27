require('../assets/css/styles.less');

module.exports = {
  Viewer: require('./Viewer'),
  Modeler: require('./Modeler'),
  bpmnProvider: require('bpmn-js-properties-panel/lib/provider/bpmn'),
  camundaProvider: require('bpmn-js-properties-panel/lib/provider/camunda'),
  customProvider: require('./provider/pemwork')
};
