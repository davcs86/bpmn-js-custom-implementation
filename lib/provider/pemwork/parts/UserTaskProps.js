'use strict';

var is = require('bpmn-js/lib/util/ModelUtil').is,
    entryFactory = require('../factory/EntryFactory'),
    candidatesHelper = require('../helper/UserTaskDefinition');

module.exports = function(group, element) {

  if(is(element, 'bpmn:UserTask')) {

     // Assignee
    group.entries.push(entryFactory.selectBox({
      id : 'assigned',
      description : 'User assigned to the User Task',
      label : 'Assigned',
      modelProperty : 'assigned',
      selectOptions : candidatesHelper.getAssignableCandidates()
    }));

    // Duration
    group.entries.push(entryFactory.textField({
      id : 'duration',
      description : 'Duration of the user task, used to calculated the due date',
      label : 'Task duration',
      modelProperty : 'duration'
    }));

  }
};
