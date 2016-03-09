'use strict';

var domQuery = require('min-dom/lib/query');
  // bpmn-js imports
  //elementHelper = require('bpmn-js-properties-panel/lib/helper/ElementHelper'),
  //cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper'),
  // local imports
  //constants = require('../../helper/Constants'),

function DiagramNameDefinition(group, element, elementFactory) {
  group.entries.push({
    'id': 'diagram-name-definition',
    'description': 'Set the diagram name',
    'html': '<label for="pemwork-diagram-name-definition" >Process name</label>' +
    '<div class="pp-field-wrapper" >' +
    '<textarea id="pemwork-diagram-name-definition"' +
    'name="diagramNameDefinition" ' +
    '>' +
    '</textarea>' +
    '</div>',

    get: function (element, propertyNode) {
      console.log(arguments);
      //console.log(timerEventDefinition);
      var diagramName = element.businessObject.di.$parent.name;

      domQuery('[name=diagramNameDefinition]', propertyNode).value = diagramName;

      return {
        diagramNameDefinition: diagramName
      };
    },
    set: function (element, values, containerElement) {
      //console.log("set");
      console.log(arguments);
      //console.log(timerEventDefinition);
      //var timerEventDefinitionTypeValue = values.timerEventDefinitionType;
      //var timerEventDefinitionValue = values.timerEventDefinition;
      //
      //var update = {
      //  'timeDuration': undefined,
      //  'timeDate': undefined,
      //  'timeCycle': undefined
      //};
      //
      //if(!!timerEventDefinitionTypeValue) {
      //  update[timerEventDefinitionTypeValue] = elementHelper.createElement
      //  (
      //    'bpmn:FormalExpression',
      //    { body: timerEventDefinitionValue },
      //    timerEventDefinition,
      //    bpmnFactory
      //  );
      //}
      //
      //return cmdHelper.updateBusinessObject(element, timerEventDefinition, update);
    },

    updateDiagramName: function(element, propertyNode, event) {
      // change the form (to the value expression)
      console.log("update");
      console.log(arguments);
      //console.log(timerEventDefinition);
      //console.log(domQuery('input[name=timerEventDefinition]', propertyNode).value);
      // update the diagram name
      return true;
    },

    cssClasses: ['pp-textfield']
  });
}

module.exports = DiagramNameDefinition;
