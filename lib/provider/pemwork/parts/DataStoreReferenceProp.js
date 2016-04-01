'use strict';

var is = require('bpmn-js/lib/util/ModelUtil').is,
    entryFactory = require('../factory/EntryFactory');
    //candidatesHelper = require('../helper/UserTaskDefinition');

module.exports = function(group, element, translate, configSettings) {

  if(is(element, 'bpmn:DataStoreReference')) {



    // Duration
    group.entries.push(entryFactory.textField({
      id : 'source',
      description : translate('Source'),
      label : translate('Source'),
      modelProperty : 'source'
    }));

  }
};
