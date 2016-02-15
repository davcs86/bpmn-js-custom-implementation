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
  toSafeInteger = require('lodash/lang').toSafeInteger,
// bpmn-js imports
  is = require('bpmn-js/lib/util/ModelUtil').is,
  elementHelper = require('bpmn-js-properties-panel/lib/helper/ElementHelper'),
  cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper'),
// local imports
  timerDefinitionHelper = require('../../helper/TimerEventDefinition'),
  constants = require('../../helper/Constants'),
// third party imports
  moment = require('moment'),
  Pikaday = require('pikaday-time'),
  MultiSelectDropdown = require('multi-select-dropdown');


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
    ' Execute <span id="eachAfterLabel">every</span>  '+
    '<input type="text" class="text-center width-120px padding-right-6px" ' +
    'data-on-change="updateTimerEventDefinitionForm" data-no-trigger-input name="eachAfterValue">' +
    ' <span id="eachAfterUnit">minutes</span>' +
    '</div>' +
    '<div id="timerCycleMonthPanel" class="'+constants.HIDE_CLASS+'">' +
    '<label for="timerCycleMonths">Months:</label>'+
    '<select name="timerCycleMonths" class="msd">' +
    '  <option value="1">January</option>'+
    '  <option value="2">February</option>'+
    '  <option value="4">March</option>'+
    '  <option value="8">April</option>'+
    '  <option value="16">May</option>'+
    '  <option value="32">June</option>'+
    '  <option value="64">July</option>'+
    '  <option value="128">August</option>'+
    '  <option value="256">September</option>'+
    '  <option value="1024">October</option>'+
    '  <option value="2048">November</option>'+
    '  <option value="4096">December</option>'+
    '</select>'+
    '<label for="timerCycleWeeks">on the:</label>'+
    '<select name="timerCycleWeeks" class="msd">' +
    '  <option value="1">First</option>'+
    '  <option value="2">Second</option>'+
    '  <option value="4">Third</option>'+
    '  <option value="8">Fourth</option>'+
    '  <option value="16">Last</option>'+
    '</select>'+
    '</div>' +
    '<div id="timerCycleWeekdaysPanel" class="'+constants.HIDE_CLASS+'">' +
      // here the repetitions to do
    '<label for="timerCycleWeekdays">on these weekdays:</label>'+
    '<select name="timerCycleWeekdays" class="msd">' +
    '  <option value="1">Sunday</option>'+
    '  <option value="2">Monday</option>'+
    '  <option value="4">Tuesday</option>'+
    '  <option value="8">Wednesday</option>'+
    '  <option value="16">Thursday</option>'+
    '  <option value="32">Friday</option>'+
    '  <option value="64">Saturday</option>'+
    '</select>'+
    '</div>' +
    '<div id="repetitionsPanel" class="'+constants.HIDE_CLASS+'">' +
    ' Stop after '+
    '<input type="text" class="text-center width-120px padding-right-6px" ' +
    'data-on-change="updateTimerEventDefinitionForm" data-no-trigger-input name="repetitions">' +
    ' executions. (Zero to execute indefinitely)' +
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
        eachAfterValueInputValue,
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
      if (!isUndefined(timerEventDefinition.picker)) {
        // but, before destroy the current one.
        timerEventDefinition.picker.destroy();
      }
      timerEventDefinition.picker = new Pikaday(
        {
          field: domQuery('input[name=pikadayPicker]', propertyNode),
          firstDay: 1,
          minDate: new Date(2000, 0, 1),
          maxDate: new Date(2300, 12, 31),
          yearRange: [2000, 2300],
          format: 'YYYY-MM-DD HH:mm:ss'
        });

      // create the mnultiselects
      var multiselects = new MultiSelectDropdown.MultiSelectDropdownManager();
      multiselects.init();

      // fill the eachAfter input
      if (timerEventDefinitionTypeValue!=='timeDate') {
        switch(timerEventDefinitionObj.tab){
          case 1:
            eachAfterValueInputValue = timerEventDefinitionObj.interval[4];
            break;
          case 2:
            eachAfterValueInputValue = timerEventDefinitionObj.interval[3];
            break;
          case 3:
            eachAfterValueInputValue = timerEventDefinitionObj.interval[2];
            break;
        }
        eachAfterValueInputValue = toSafeInteger(eachAfterValueInputValue);
        if (eachAfterValueInputValue === 0) {
          eachAfterValueInputValue = 1;
        }
      }

      setTimeout(function(){
        // set values to elements in the group (the timeout is to wait the elements to be created)
        // fill the every/after box
        domQuery('[name=eachAfterValue]', propertyNode).value = eachAfterValueInputValue;
        // set the datetimepicker
        timerEventDefinition.picker.setMoment(moment(timerEventDefinitionObj.start_date));
        // fill the # of repetitions
        if (timerEventDefinitionTypeValue==='timeCycle') {
          domQuery('[name=repetitions]', propertyNode).value = toSafeInteger(timerEventDefinitionObj.repetitions);
        } else {
          domQuery('[name=repetitions]', propertyNode).value = 1;  // Date and Duration are considered as a cycle with one repetition
        }
        domQuery('input[name=timerEventDefinition]', propertyNode).value = timerEventDefinitionValue;
      }, 100);
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
        timerCycleMonthPanel,
        timerCycleWeekdaysPanel,
        timerCycleWeekdaysLabel,
        eachAfterValueInput,
        eachAfterLabel,
        eachAfterUnit,
        eachAfterUnitStr,
        repetitionsInput,
        repetitionsPanel,
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
      timerCycleMonthPanel = domQuery('[id=timerCycleMonthPanel]', propertyNode);
      domClasses(timerCycleMonthPanel).add(constants.HIDE_CLASS);
      timerCycleWeekdaysPanel = domQuery('[id=timerCycleWeekdaysPanel]', propertyNode);
      domClasses(timerCycleWeekdaysPanel).add(constants.HIDE_CLASS);
      timerCycleWeekdaysLabel = domQuery('[for=timerCycleWeekdays]', propertyNode);
      eachAfterLabel = domQuery('[id=eachAfterLabel]', propertyNode);
      eachAfterUnit = domQuery('[id=eachAfterUnit]', propertyNode);
      repetitionsPanel = domQuery('[id=repetitionsPanel]', propertyNode);
      domClasses(repetitionsPanel).add(constants.HIDE_CLASS);

      if (timerEventDefinitionTypeValue!=='timeDate') {
        // update the state of selectTimerCycleType
        forEach(selectTimerCycleType.children, function (option) {
          option.disabled = !has(optionsTimerCycleTypeToEnable, option.value);
          if (option.disabled && selectTimerCycleType.value === option.value) {
            // un-select disabled elements
            domAttr(option, 'selected', null);
          } else if (!option.disabled && selectTimerCycleType.value === option.value) {
            // select enabled (and selected) elements
            domAttr(option, 'selected', 'selected');
          }
          if (!firstEnabledOption && !option.disabled) {
            firstEnabledOption = option;
          }
        });
        if (!has(optionsTimerCycleTypeToEnable, selectTimerCycleType.value)) {
          // select the first enabled item
          domAttr(firstEnabledOption, 'selected', 'selected');
        }
        domClasses(selectTimerCycleType).remove(constants.HIDE_CLASS);

        switch (selectTimerCycleType.value) {
          case '1': // minute
            if (!eachAfterUnitStr)
              eachAfterUnitStr = "minute(s)";
          /* falls through */
          case '2': // hour
            if (!eachAfterUnitStr)
              eachAfterUnitStr = "hour(s)";
          /* falls through */
          case '3': // day
            if (!eachAfterUnitStr)
              eachAfterUnitStr = "day(s)";

            eachAfterUnit.innerHTML = eachAfterUnitStr;
            // show the "each XX (minute|hour|day)" panel
            domClasses(showEachAfterXXUnitPanel).remove(constants.HIDE_CLASS);
            // adjust label
            eachAfterLabel.innerHTML = (timerEventDefinitionTypeValue === 'timeCycle') ? 'every' : 'after';
            break;
          case '4': // week
            domClasses(timerCycleWeekdaysPanel).remove(constants.HIDE_CLASS);
            domClasses(timerCycleWeekdaysLabel).remove(constants.HIDE_CLASS);
            break;
          case '5': // month
            // show the week/month panel
            domClasses(timerCycleMonthPanel).remove(constants.HIDE_CLASS);
            domClasses(timerCycleWeekdaysPanel).remove(constants.HIDE_CLASS);
            domClasses(timerCycleWeekdaysLabel).add(constants.HIDE_CLASS);
            break;
        }
        if (timerEventDefinitionTypeValue==='timeCycle'){
          // show the number of repetitions
          domClasses(repetitionsPanel).remove(constants.HIDE_CLASS);
        }
      }

      if (!isUndefined(event)) {
        event.cancelBubble = true;
      }
      // fix the inout
      eachAfterValueInput = domQuery('[name=eachAfterValue]', propertyNode);
      eachAfterValueInput.value = toSafeInteger(eachAfterValueInput.value);
      if (eachAfterValueInput.value === '0') {
        eachAfterValueInput.value = 1;
      }
      // fix the # of repetitions
      repetitionsInput = domQuery('[name=repetitions]', propertyNode);
      repetitionsInput.value = toSafeInteger(repetitionsInput.value);
      if (timerEventDefinitionTypeValue !== 'timeCycle' && eachAfterValueInput.value === '0') {
        eachAfterValueInput.value = 1;
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
