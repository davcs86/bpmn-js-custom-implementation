'use strict';

var is = require('bpmn-js/lib/util/ModelUtil').is,
    entryFactory = require('../factory/EntryFactory'),
    candidatesHelper = require('../helper/UserTaskDefinition');

module.exports = function(group, element, translate) {

  if(is(element, 'bpmn:UserTask')) {

     // Assignee
    group.entries.push(entryFactory.selectBox({
      id : 'assigned',
      description : translate.t('User assigned to the User Task'),
      label : translate.t('Assigned'),
      modelProperty : 'assigned',
      selectOptions : candidatesHelper.getAssignableCandidates()
    }));

    // Duration
    group.entries.push(entryFactory.textField({
      id : 'duration',
      description : translate.t('Duration of the user task, used to calculated the due date'),
      label : translate.t('Task duration'),
      modelProperty : 'duration'
    }));

  }
};
