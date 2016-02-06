'use strict';

var domQuery = require('min-dom/lib/query'),
    forEach = require('lodash/collection/forEach'),
    is = require('bpmn-js/lib/util/ModelUtil').is,
    //elementHelper = require('bpmn-js-properties-panel/lib/helper/ElementHelper'),
    //cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper'),
    timerDefinitionHelper = require('../../../../helper/TimerEventDefinition'),
    domify = require('min-dom/lib/domify'),
    domAttr = require('min-dom/lib/attr');


function TimerEventDefinition(group, element, bpmnFactory, timerEventDefinition) {
  group.entries.push({
    'id': 'timer-event-definition',
    'description': 'Configure the timer event definition',
    'html': '<label for="camunda-delegate">Timer Definition</label>' +
            '<div class="pp-field-wrapper">' +
              '<input id="camunda-timerEventDefinition" type="hidden" name="timerEventDefinition"/>' +
              '<button class="clear" data-action="clear" data-show="canClear">' +
                '<span>X</span>' +
              '</button>' +
              '<select id="camunda-timerEventDefinitionType" name="timerEventDefinitionType"'+
              ' data-on-change="updateTimerEventDefinitionForm" data-value>' +
              '</select>' +
            '</div>',

    get: function (element, propertyNode) {

      // read values from xml:
      var boTimeDuration = timerEventDefinition.get('timeDuration'),
          boTimeDate = timerEventDefinition.get('timeDate'),
          boTimeCycle = timerEventDefinition.get('timeCycle'),
          isStartEvent = is(element, 'bpmn:StartEvent'),
          isBoundaryEvent = is(element, 'bpmn:BoundaryEvent'),
          isIntermediateEvent = is(element, 'bpmn:IntermediateCatchEvent'),
          timerEventDefinitionValue,
          timerEventDefinitionTypeValue,
          optionTemplate,
          optionsDropDown = [];


      if(!!boTimeDuration && !!boTimeDuration.get('body') && (!!isBoundaryEvent || !!isIntermediateEvent)) {
        timerEventDefinitionValue = timerDefinitionHelper.cleanFormat(boTimeDuration.get('body'));
        timerEventDefinitionTypeValue = 'timeDuration';
      }
      else if (!!boTimeDate && !!boTimeDate.get('body') && !!isStartEvent) {
        timerEventDefinitionValue = timerDefinitionHelper.cleanFormat(boTimeDate.get('body'));
        timerEventDefinitionTypeValue = 'timeDate';
      }
      else if(!!boTimeCycle && boTimeCycle.get('body') && (!!isStartEvent || !!isBoundaryEvent)) {
        timerEventDefinitionValue = timerDefinitionHelper.cleanFormat(boTimeCycle.get('body'));
        timerEventDefinitionTypeValue = 'timeCycle';
      }

      // add the possible dropdown options
      if (!!isBoundaryEvent || !!isIntermediateEvent) {
          optionsDropDown.push({id:'timeDuration', value:'Duration'});
      }
      if (!!isStartEvent) {
          optionsDropDown.push({id:'timeDate', value:'Specific Date'});
      }
      if (!!isStartEvent || !!isBoundaryEvent) {
          optionsDropDown.push({id:'timeCycle', value:'Interval / Cycle'});
      }

      var selectEventDefinitionType = domQuery('select[name=timerEventDefinitionType]', propertyNode);

      // select the current timerEventDefinitionType
      forEach(optionsDropDown, function(option) {
        optionTemplate = domify('<option value="' + option.id + '">'+option.value+'</option>');
        if (timerEventDefinitionTypeValue === option.id) {
          domAttr(optionTemplate, 'selected', 'selected');
        } else {
          domAttr(optionTemplate, 'selected', null);
        }
        // add new option
        selectEventDefinitionType.appendChild(optionTemplate);
      });
      if (typeof timerEventDefinitionTypeValue === 'undefined') {
          // by default, select the first option
          domAttr(selectEventDefinitionType.firstChild, 'selected', 'selected');
      }

      return {
        timerEventDefinition: timerEventDefinitionValue,
        timerEventDefinitionType: timerEventDefinitionTypeValue
      };
    },
    set: function (element, values, containerElement) {

      return {};
      /*var timerEventDefinitionTypeValue = values.timerEventDefinitionType;
      var timerEventDefinitionValue = values.timerEventDefinition;

      var update = {
        'timeDuration': undefined,
        'timeDate': undefined,
        'timeCycle': undefined
      };

      if(!!timerEventDefinitionTypeValue) {
        update[timerEventDefinitionTypeValue] = elementHelper.createElement
        (
          'bpmn:FormalExpression',
          { body: timerEventDefinitionValue },
          timerEventDefinition,
          bpmnFactory
        );
      }

      return cmdHelper.updateBusinessObject(element, timerEventDefinition, update);*/
    },
    validate: function(element, values) {
        var validationResult = {};
      /*var timerEventDefinitionTypeValue = values.timerEventDefinitionType;
      var timerEventDefinitionValue = values.timerEventDefinition;

      var validationResult = {};

      if(!timerEventDefinitionValue && timerEventDefinitionTypeValue) {
        validationResult.timerEventDefinition = 'Value must provide a value.';
      }

      if(timerEventDefinitionValue && !timerEventDefinitionTypeValue) {
        validationResult.timerEventDefinitionType = 'Must select a radio button';
    }*/

      return validationResult;
    },
    clear: function(element, inputNode) {
      // clear text input
      domQuery('input[name=timerEventDefinition]', inputNode).value='';
      // clear radio button selection
      var checkedRadio = domQuery('input[name=timerEventDefinitionType]:checked', inputNode);
      if(!!checkedRadio) {
        checkedRadio.checked = false;
      }
      return true;
    },
    canClear: function(element, inputNode) {
      var input = domQuery('input[name=timerEventDefinition]', inputNode);
      var radioButton = domQuery('input[name=timerEventDefinitionType]:checked', inputNode);
      return input.value !== '' || !!radioButton;
    },

    updateTimerEventDefinitionForm: function(element, inputNode) {

        return true;
    }

    cssClasses: ['pp-textfield']
  });
}

module.exports = TimerEventDefinition;
