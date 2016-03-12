'use strict';


var inherits = require('inherits'),
    PropertiesActivator = require('bpmn-js-properties-panel/lib/PropertiesActivator');

// bpmn properties
var nameProps = require('./parts/NameProps'),
    eventProps = require('./parts/EventProps'),
    userTaskProps = require('./parts/UserTaskProps');

function createGeneralTabGroups(element, bpmnFactory, elementRegistry, translate) {

    var generalGroup = {
      id: 'general',
      label: translate.t('General'),
      entries: []
    };

    nameProps(generalGroup, element, elementRegistry, translate);
    eventProps(generalGroup, element, bpmnFactory, translate);
    userTaskProps(generalGroup, element, translate);

    return[
      generalGroup
    ];
}

// Pemwork Properties Provider /////////////////////////////////////
function PemworkPropertiesProvider(eventBus, bpmnFactory, elementRegistry, translate) {

  PropertiesActivator.call(this, eventBus);
  var currentElem;
  // update properties panel when language changes
  //var that = this;
  eventBus.on('translate.applyLanguage', function(){
    // fake a selection event in order to update the current form
    eventBus.fire('selection.changed', { newSelection: [currentElem], oldSelection: [] });
  });

  this.getTabs = function(element) {
    currentElem = element;
    var generalTab = {
      id: 'general',
      label: 'General',
      groups: createGeneralTabGroups(element, bpmnFactory, elementRegistry, translate)
    };

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
      //variablesTab,
      //formsTab
    ];
  };

}

// bpmn-js modules required for this properties provider, diagram is used to avoid circular dependency
PemworkPropertiesProvider.$inject = ['eventBus', 'bpmnFactory', 'elementRegistry', 'translate'];


inherits(PemworkPropertiesProvider, PropertiesActivator);

module.exports = PemworkPropertiesProvider;
