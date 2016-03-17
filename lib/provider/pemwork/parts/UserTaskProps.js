'use strict';

var is = require('bpmn-js/lib/util/ModelUtil').is,
    entryFactory = require('../factory/EntryFactory'),
    candidatesHelper = require('../helper/UserTaskDefinition');

module.exports = function(group, element, translate, configSettings) {

  if(is(element, 'bpmn:UserTask')) {

     // Assignee
    group.entries.push(entryFactory.selectBox({
      id : 'assigned',
      description : translate('User assigned to the User Task'),
      label : translate('Assigned'),
      modelProperty : 'assigned',
      selectOptions : candidatesHelper.getAssignableCandidates(configSettings)
    }));

    // Duration
    group.entries.push(entryFactory.textField({
      id : 'duration',
      description : translate('Duration of the user task, used to calculated the due date'),
      label : translate('Task duration'),
      modelProperty : 'duration'
    }));

  }
};
