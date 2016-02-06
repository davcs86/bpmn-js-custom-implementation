'use strict';

var is = require('bpmn-js/lib/util/ModelUtil').is,
  entryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory'),
  participantHelper = require('bpmn-js-properties-panel/lib/helper/ParticipantHelper');

module.exports = function(group, element) {
  if (is(element, 'bpmn:Process') || is(element, 'bpmn:Participant')) {

    /**
     * name
     */
    var label = 'Process name';//(is(element, 'bpmn:Participant')) ? 'Process name' : 'Name';

    var nameEntry = entryFactory.textField({
      id: 'name',
      description: '-',
      label: label,
      modelProperty: 'name'
    });

    // in participants we have to change the default behavior of set and get
    if(is(element, 'bpmn:Participant')) {
      nameEntry.get = function (element) {
        return participantHelper.getProcessBusinessObject(element, 'name');
      };

      nameEntry.set = function (element, values) {
        return participantHelper.modifyProcessBusinessObject(element, 'name', values);
      };
    }

    group.entries.push(nameEntry);

    /**
     * isExecutable // Always consider executable
     *
    var executableEntry = entryFactory.checkbox({
      id: 'isExecutable',
      description: 'Defines if a process is executable by a process engine',
      label: 'Executable',
      modelProperty: 'isExecutable'
    });

    // in participants we have to change the default behavior of set and get
    if(is(element, 'bpmn:Participant')) {
      executableEntry.get = function (element) {
        return participantHelper.getProcessBusinessObject(element, 'isExecutable');
      };

      executableEntry.set = function (element, values) {
        return participantHelper.modifyProcessBusinessObject(element, 'isExecutable', values);
      };
    }

    group.entries.push(executableEntry);*/
  }
};
