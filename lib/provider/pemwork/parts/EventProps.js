'use strict';

var is = require('bpmn-js/lib/util/ModelUtil').is,
  eventDefinitionHelper = require('bpmn-js-properties-panel/lib/helper/EventDefinitionHelper');

var forEach = require('lodash/collection').forEach;

var timer = require('./implementation/TimerEventDefinition');


module.exports = function(group, element, bpmnFactory) {
  // Timer Event Definition
  var timerEvents = [
    'bpmn:StartEvent',
    'bpmn:BoundaryEvent',
    'bpmn:IntermediateCatchEvent'
  ];

  forEach(timerEvents, function(event) {
    if(is(element, event)) {
      // get business object
      var timerEventDefinition = eventDefinitionHelper.getTimerEventDefinition(element);
      if(timerEventDefinition) {
        timer(group, element, bpmnFactory, timerEventDefinition);
      }
    }
  });

};
