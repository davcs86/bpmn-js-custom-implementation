'use strict';

var is = require('bpmn-js/lib/util/ModelUtil').is,
    entryFactory = require('../factory/EntryFactory'),
    ScriptTaskHelper = require('../helper/ScriptTaskDefinition');

module.exports = function(group, element, translate, configSettings) {

  if(is(element, 'bpmn:ServiceTask')) {

     // Assignee
    group.entries.push(entryFactory.selectBox({
      id : 'boots',
      description : translate('Configuration assigned to a task'),
      label : translate('Boot configuration'),
      modelProperty : 'bootconfig',
      selectOptions : ScriptTaskHelper.getAssignableBoots(configSettings)
    }));


  }
};
