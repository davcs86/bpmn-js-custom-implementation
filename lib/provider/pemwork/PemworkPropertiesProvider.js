'use strict';


var inherits = require('inherits'),
    PropertiesActivator = require('bpmn-js-properties-panel/lib/PropertiesActivator');

// bpmn properties
var nameProps = require('./parts/NameProps'),
    eventProps = require('./parts/EventProps'),
    userTaskProps = require('./parts/UserTaskProps'),
    SequenceFlowProps = require('./parts/SequenceFlowProps'),
    DataStoreReferenceProps = require('./parts/DataStoreReferenceProp'),
    FormPropes = require('./parts/FormProps');

function createGeneralTabGroups(element, bpmnFactory, elementRegistry, translate, configSettings) {

  var generalGroup = {
    id: 'general',
    label: translate('General'),
    entries: []
  };

  nameProps(generalGroup, element, elementRegistry, translate);

  var timersGroup = {
      id: 'timers',
      label: translate('Timer definition'),
      entries: []
  };

  eventProps(timersGroup, element, bpmnFactory, translate);
  userTaskProps(generalGroup, element, translate, configSettings);
  SequenceFlowProps(generalGroup, element, bpmnFactory, translate);
  DataStoreReferenceProps(generalGroup, element, translate, configSettings);
  return[
    generalGroup,
    timersGroup
  ];
}
function createFormsTabGroups1(element, bpmnFactory, elementRegistry, translate, configSettings) {

  var FormsGroups = {
    id: 'FormsGroup',
    label: translate('Forms'),
    entries: []
  };

 FormPropes(FormsGroups, element, elementRegistry, translate);

  return[
    FormsGroups

  ];
}
//function createPruebaTabGroups(element, bpmnFactory, elementRegistry, translate) {



  //  var pruebitaGroup = {
  //      id: 'prop',
  //      label: 'Definición de pruebas',
  //      entries: []
  //  };

    // eventProps(timersGroup, element, bpmnFactory, translate);
  //  pruebaProps(pruebitaGroup, element, translate);

 //   return[
   //     pruebitaGroup
  //  ];
//}
// Pemwork Properties Provider /////////////////////////////////////
function PemworkPropertiesProvider(eventBus, bpmnFactory, elementRegistry, translate, configSettings) {

  PropertiesActivator.call(this, eventBus);
  //var currentElem;
  //// update properties panel when language changes
  ////var that = this;
  //eventBus.on('translate.applyLanguage', function(){
  //  // fake a selection event in order to update the current form
  //  eventBus.fire('selection.changed', { newSelection: [currentElem], oldSelection: [] });
  //});

  this.getTabs = function(element) {
    //currentElem = element;
    var generalTab = {
      id: 'general',
      label: translate('General'),
      groups: createGeneralTabGroups(element, bpmnFactory, elementRegistry, translate, configSettings)
    };
     var formsTab = {
      id: 'forms',
      label:translate('Forms'),// 'Forms',
      groups: createFormsTabGroups1(element, bpmnFactory, elementRegistry, translate, configSettings)
    };
//var tabPrueba={
   // id:'prueba',
  //  label:'prueba',
 //   groups:createPruebaTabGroups(element, bpmnFactory, elementRegistry, translate)
//};
    /*var variablesTab = {
      id: 'variables',
      label: 'Process variables',
      groups: createVariablesTabGroups(element, bpmnFactory, elementRegistry)
    };

    var formsTab = {
      id: 'forms',
      label: 'Forms',
      groups: createFormsTabGroups(element, bpmnFactory, elementRegistry)
  };*/

    return [
      generalTab,
      formsTab

      //,
       // tabPrueba
      //variablesTab,
      //formsTab
    ];
  };

}

// bpmn-js modules required for this properties provider, diagram is used to avoid circular dependency
PemworkPropertiesProvider.$inject = [
  'eventBus',
  'bpmnFactory',
  'elementRegistry',
  'translate',
  'config.pemworkSettings'
];


inherits(PemworkPropertiesProvider, PropertiesActivator);

module.exports = PemworkPropertiesProvider;
