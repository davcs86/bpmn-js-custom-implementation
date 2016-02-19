'use strict';

var is = require('bpmn-js/lib/util/ModelUtil').is,
    entryFactory = require('../factory/EntryFactory'),
    candidatesHelper = require('../helper/UserTaskDefinition');

module.exports = function(group, element) {
  if(is(element, 'bpmn:UserTask')) {

     // Assignee
    group.entries.push(entryFactory.selectBox({
      id : 'assignee',
      description : 'Assignee of the User Task',
      label : 'Assignee',
      modelProperty : 'assignee',
      selectOptions : candidatesHelper.getAssignableCandidates(),
      allowEmpty : false // business rule, all user tasks must be assigned
    }));

    // Duration
    group.entries.push(entryFactory.textField({
      id : 'duration',
      description : 'The due date as an EL expression (e.g. ${someDate} or an ISO date (e.g. 2015-06-26T09:54:00)',
      label : 'Task duration',
      modelProperty : 'duration'
    }));

  }
};
