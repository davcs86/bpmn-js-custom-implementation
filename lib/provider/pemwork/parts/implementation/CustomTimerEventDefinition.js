'use strict';

var domQuery = require('min-dom/lib/query'),
  domClasses = require('min-dom/lib/classes'),
  //domify = require('min-dom/lib/domify'),
  domAttr = require('min-dom/lib/attr'),
// lodash imports
  forEach = require('lodash/collection').forEach,
  //forIn = require('lodash/object').forIn,
  isUndefined = require('lodash/lang').isUndefined,
  has = require('lodash/object').has,
  //trim = require('lodash/string').trim,
// bpmn-js imports
  is = require('bpmn-js/lib/util/ModelUtil').is,
  elementHelper = require('bpmn-js-properties-panel/lib/helper/ElementHelper'),
  cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper'),
// local imports
  timerDefinitionHelper = require('../../helper/TimerEventDefinition'),
  constants = require('../../helper/Constants'),
// third party imports
  moment = require('moment'),
  Pikaday = require('pikaday-time');


function TimerEventDefinition(group, element, bpmnFactory, timerEventDefinition) {
  group.entries.push({
    'id': 'timer-event-definition',
    'description': 'Configure the timer event definition',
    'html': '<label for="pemwork-delegate">Timer Definition</label>' +
    '<div class="pp-field-wrapper">' +
    '<input id="pemwork-timerEventDefinition" data-entry '+
    ' class="'/*+constants.HIDE_CLASS*/+'" name="timerEventDefinition"' +
    ' data-no-trigger-change/>' +
    '<select id="pemwork-timerEventDefinitionType" name="timerEventDefinitionType"' +
    ' data-on-change="updateTimerEventDefinitionForm">' +
    '  <option value="timeDate">Fixed date</option>'+
    '  <option value="timeDuration">Duration</option>'+
    '  <option value="timeCycle">Interval / Cycle</option>'+
    '</select>' +
    '<div>' +
      // here the pickaday element
    '<label for="pikadayPicker">Start date</label>'+
    ' <input type="text" class="text-center" data-no-trigger-change name="pikadayPicker"/><br/>' +
    '<select name="timerCycleType" data-on-change="updateTimerEventDefinitionForm"'+
    ' class="'+constants.HIDE_CLASS+'">' +
    '  <option value="1">Minutely</option>'+
    '  <option value="2">Hourly</option>'+
    '  <option value="3">Daily</option>'+
    '  <option value="4">Weekly</option>'+
    '  <option value="5">Monthly</option>'+
    '</select>'+
    '</div>' +
    '<div id="showEachAfterXXUnitPanel" class="'+constants.HIDE_CLASS+'">' +
    ' Execute <span>every</span>  <input type="text" class="text-center" data-no-trigger-change name="eachAfterValue">' +
    ' <span>minutes</span>' +
    '</div>' +
    '<div id="showEachAfterXXUnitPanel" class="'+constants.HIDE_CLASS+'">' +
    '</div>' +
    '<div data-show="showCyclePanel" class="'+constants.HIDE_CLASS+'">' +
      // here the repetitions to do
    '</div>' +
    '<button class="btn-inline"'+
    ' data-action="saveTimerEventDefinition">Apply changes</button>' +
    '</div>',

    get: function (element, propertyNode) {
      console.log("get");
      console.log(arguments);
      console.log(timerEventDefinition);

      // read values from xml:
      var boTimeDuration = timerEventDefinition.get('timeDuration'),
        boTimeDate = timerEventDefinition.get('timeDate'),
        boTimeCycle = timerEventDefinition.get('timeCycle'),
        isStartEvent = is(element, 'bpmn:StartEvent'),
        isBoundaryEvent = is(element, 'bpmn:BoundaryEvent'),
        isIntermediateEvent = is(element, 'bpmn:IntermediateCatchEvent'),
        timerEventDefinitionValue,
        timerEventDefinitionTypeValue,
        timerEventDefinitionObj,
        firstEnabledOption = null,
        selectEventDefinitionType,
        optionsToEnable = {};

      if(!!boTimeDuration && (!!isBoundaryEvent || !!isIntermediateEvent)) {
        timerEventDefinitionTypeValue = 'timeDuration';
        timerEventDefinitionValue = timerDefinitionHelper.cleanExpression(boTimeDuration.get('body'));
        timerEventDefinitionObj = timerDefinitionHelper.expressionToObj(timerEventDefinitionValue,
          timerEventDefinitionTypeValue);
      }
      else if (!!boTimeDate && !!isStartEvent) {
        timerEventDefinitionTypeValue = 'timeDate';
        timerEventDefinitionValue = timerDefinitionHelper.cleanExpression(boTimeDate.get('body'));
        timerEventDefinitionObj = timerDefinitionHelper.expressionToObj(timerEventDefinitionValue,
          timerEventDefinitionTypeValue);
      }
      else if(!!boTimeCycle && (!!isStartEvent || !!isBoundaryEvent)) {
        timerEventDefinitionTypeValue = 'timeCycle';
        timerEventDefinitionValue = timerDefinitionHelper.cleanExpression(boTimeCycle.get('body'));
        timerEventDefinitionObj = timerDefinitionHelper.expressionToObj(timerEventDefinitionValue,
          timerEventDefinitionTypeValue);
      }
      // add the possible dropdown options
      if (!!isBoundaryEvent || !!isIntermediateEvent) {
        optionsToEnable.timeDuration = true;
      }
      if (!!isStartEvent) {
        optionsToEnable.timeDate = true;
      }
      if (!!isStartEvent || !!isBoundaryEvent) {
        optionsToEnable.timeCycle = true;
      }
      // select the current timerEventDefinitionType
      selectEventDefinitionType = domQuery('select[name=timerEventDefinitionType]', propertyNode);
      forEach(selectEventDefinitionType.children, function(option) {
        option.disabled = !has(optionsToEnable, option.value);
        if (timerEventDefinitionTypeValue === option.value && !option.disabled) {
          domAttr(option, 'selected', 'selected');
        } else {
          domAttr(option, 'selected', null);
        }
        if (!firstEnabledOption && !option.disabled){
          firstEnabledOption = option;
        }
      });

      if (isUndefined(timerEventDefinitionTypeValue)) {
        // by default, select the first option
        domAttr(firstEnabledOption, 'selected', 'selected');
        timerEventDefinitionTypeValue = firstEnabledOption.value;
        timerEventDefinitionObj = timerDefinitionHelper.expressionToObj('', timerEventDefinitionTypeValue);
      }

      timerEventDefinitionValue = timerDefinitionHelper.objectToExpression(timerEventDefinitionObj);

      // create the datetimepicker
      var pickerElement = domQuery('input[name=pikadayPicker]', propertyNode);

      if (!isUndefined(timerEventDefinition.picker)) {
        timerEventDefinition.picker.destroy();
      }
      timerEventDefinition.picker = new Pikaday(
        {
          field: pickerElement,
          firstDay: 1,
          minDate: new Date(2000, 0, 1),
          maxDate: new Date(2300, 12, 31),
          yearRange: [2000, 2300],
          format: 'YYYY-MM-DD HH:mm:ss'
        });
      // datetimepicker
      setTimeout(function(){
        timerEventDefinition.picker.setMoment(moment(timerEventDefinitionObj.start_date));
      }, 100);

      domQuery('input[name=timerEventDefinition]', propertyNode).value = timerEventDefinitionValue;
      this.updateTimerEventDefinitionForm(element, propertyNode);
      return {
        timerEventDefinition: timerEventDefinitionValue,
        timerEventDefinitionType: timerEventDefinitionTypeValue
      };
    },
    set: function (element, values, containerElement) {
      console.log("set");
      console.log(arguments);
      console.log(timerEventDefinition);
      var timerEventDefinitionTypeValue = values.timerEventDefinitionType;
      var timerEventDefinitionValue = values.timerEventDefinition;

      var update = {
        'timeDuration': undefined,
        'timeDate': undefined,
        'timeCycle': undefined
      };

      // get the timerEventDefinition from the form

      if(!!timerEventDefinitionTypeValue) {
        update[timerEventDefinitionTypeValue] = elementHelper.createElement
        (
          'bpmn:FormalExpression',
          { body: timerEventDefinitionValue },
          timerEventDefinition,
          bpmnFactory
        );
      }

      return cmdHelper.updateBusinessObject(element, timerEventDefinition, update);
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

    updateTimerEventDefinitionForm: function(element, propertyNode, event) {
      // change the form (to the value expression)
      console.log("update");
      console.log(arguments);
      console.log(timerEventDefinition);
      console.log(domQuery('input[name=timerEventDefinition]', propertyNode).value);

      // read values from xml:
      var isStartEvent = is(element, 'bpmn:StartEvent'),
        isBoundaryEvent = is(element, 'bpmn:BoundaryEvent'),
        isIntermediateEvent = is(element, 'bpmn:IntermediateCatchEvent'),
        timerEventDefinitionTypeValue,
        firstEnabledOption = null,
        selectTimerCycleType,
        showEachAfterXXUnitPanel,
        showCyclePanel,
        optionsTimerCycleTypeToEnable = {};

      timerEventDefinitionTypeValue = domQuery('select[name=timerEventDefinitionType]', propertyNode).value;

      if(timerEventDefinitionTypeValue == 'timeDuration' && (!!isBoundaryEvent || !!isIntermediateEvent)) {
        optionsTimerCycleTypeToEnable['1'] = 'Minutely';
        optionsTimerCycleTypeToEnable['2'] = 'Hourly';
        optionsTimerCycleTypeToEnable['3'] = 'Daily';
      }
      else if(timerEventDefinitionTypeValue == 'timeCycle' && (!!isStartEvent || !!isBoundaryEvent)) {
        optionsTimerCycleTypeToEnable['1'] = 'Minutely';
        optionsTimerCycleTypeToEnable['2'] = 'Hourly';
        optionsTimerCycleTypeToEnable['3'] = 'Daily';
        optionsTimerCycleTypeToEnable['4'] = 'Weekly';
        optionsTimerCycleTypeToEnable['5'] = 'Monthly';
      }

      // hide everything but the datetimepicker
      selectTimerCycleType = domQuery('select[name=timerCycleType]', propertyNode);
      domClasses(selectTimerCycleType).add(constants.HIDE_CLASS);
      showEachAfterXXUnitPanel = domQuery('[id=showEachAfterXXUnitPanel]', propertyNode);
      domClasses(showEachAfterXXUnitPanel).add(constants.HIDE_CLASS);
      showCyclePanel = domQuery('[id=showCyclePanel]', propertyNode);
      domClasses(showEachAfterXXUnitPanel).add(constants.HIDE_CLASS);

      if (timerEventDefinitionTypeValue!=='timeDate'){
        // update the state of selectTimerCycleType
        forEach(selectTimerCycleType.children, function(option) {
          option.disabled = !has(optionsTimerCycleTypeToEnable, option.value);
          if (option.disabled && selectTimerCycleType.value === option.value){
            // un-select disabled elements
            domAttr(option, 'selected', null);
          }
          if (!firstEnabledOption && !option.disabled){
            firstEnabledOption = option;
          }
        });
        if (!has(optionsTimerCycleTypeToEnable, selectTimerCycleType)){
          // select the first enabled item
          domAttr(firstEnabledOption, 'selected', 'selected');
        }
        domClasses(selectTimerCycleType).remove(constants.HIDE_CLASS);

        switch (selectTimerCycleType.value) {
          case 1: // minute
          case 2: // hour
          case 3: // day
            // show the "each XX (minute|hour|day)" panel
            domClasses(showEachAfterXXUnitPanel).remove(constants.HIDE_CLASS);
            break;
          case 4: // week
          case 5: // month
            // show the week/month panel

            break;
        }
      } else {

      }

      if (!isUndefined(event)) {
        event.cancelBubble = true;
      }
      return true;
    },

    saveTimerEventDefinition: function(element, inputNode, event) {
      console.log("save");
      console.log(arguments);
      console.log(timerEventDefinition);
      return true;
    },

    cssClasses: ['pp-textfield']
  });
}

module.exports = TimerEventDefinition;
