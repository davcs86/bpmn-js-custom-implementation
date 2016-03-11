require('../assets/css/styles.less');
module.exports = {
  Viewer: require('./Viewer'),
  Modeler: require('./Modeler'),
  PropertiesProviders: {
    current: 'Custom',
    providers: {
      'BPMN 2.0': require('bpmn-js-properties-panel/lib/provider/bpmn'),
      'Camunda': require('bpmn-js-properties-panel/lib/provider/camunda'),
      'Custom': require('./provider/pemwork')
    }
  }

};
