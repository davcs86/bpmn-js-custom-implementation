'use strict';


var domQuery = require('min-dom/lib/query'),
 domClasses = require('min-dom/lib/classes'),
    domAttr = require('min-dom/lib/attr');
// lodash imports
var   forEach = require('lodash/collection').forEach,
    isUndefined = require('lodash/lang').isUndefined,
    has = require('lodash/object').has,
// toSafeInteger = require('lodash/lang').toSafeInteger,
// bpmn-js imports
   // is = require('bpmn-js/lib/util/ModelUtil').is,
   //elementHelper = require('bpmn-js-properties-panel/lib/helper/ElementHelper'),
 cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper'),
// local imports
// timerDefinitionHelper = require('../../helper/TimerEventDefinition'),
    constants = require('../../helper/Constants');
// third party imports
//   moment = require('moment'),
//  Pikaday = require('pikaday-time'),
//  MultiSelectDropdown = require('multi-select-dropdown');
var  getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject,
    getExtensionElements = require('../../helper/ExtensionElementsHelper').getExtensionElements;

function SequenceFlowDefinition(group, element, bpmnFactory, elementRegistry, translate) {

  var root = elementRegistry.getAll()[0];
  var bo = getBusinessObject(root),
      formData = getExtensionElements(bo, 'pemwork:FormData');

  var OptionHTML;
  if (!isUndefined(formData) && !isUndefined(formData[0]) && !isUndefined(formData[0].fields)) {

    forEach(formData[0].fields, function (option) {
      switch (option.type) {
        case "File":
        case "Double":
        case "Boolean":
        case "String":
          OptionHTML += '<option value="' + option.id + '">' + option.id + '</option>';

          break;
      }

    });
  }
  var titleProcessVar=translate('Process variables'),
      titleCond=translate('Condition'),
      titleVal=translate('Value'),
      titleApply=translate('Apply changes');
  group.entries.push({
    'id': 'sequence-flows-definition',
    'description': translate('Configure Process variables definition'),
    'html': '<label for="pemwork-delegate">'+titleProcessVar+'</label>' +
    '<div class="pp-field-wrapper">' +
    '<input id="pemwork-ResultEventDefinition" data-entry '+
    '  name="conditionPemwork" />' +
    '<select id="pemwork-processvariable" name="processvariable"' +
    ' data-on-change="updateEventDefinitionForm">' +
    '  <option value="">-------</option>' +
    OptionHTML +
    '</select>' +
    '</div>' +
    '<label  for="conditionType">'+titleCond+'</label>'+
    '<div class="pp-field-wrapper">' +
    '<select name="selectCondition" '+
    '">' +
      //  '  <option value=""></option>' +
    '  <option value="==">==</option>'+
    '  <option value="!=">!=</option>'+
    '  <option value="<">&lt;</option>'+
    '  <option value=">"> &gt;</option>'+
    '  <option value="<=">&lt;=</option>'+
    '  <option value=">=">&gt;=</option>'+
    '  <option value=".fileExist">File exist</option>'+
    '  <option value=".isTrue">is True</option>'+
    '  <option value=".isFalse">is False</option>'+
    '</select>'+
    '</div>'+
    '<div id="CondPanel" style="margin-left:5px; margin-top: 5px;"  class="'+constants.HIDE_CLASS+'"  >' +

    '<label  for="conditionValue">'+titleVal+'</label>'+

    '<input id="pemwork-condition" name="conditionEventDefinition" ' +
    'data-no-trigger-change data-no-trigger-input value=""/>' +
    '</div>' +
    '<div style="margin-left:5px; margin-top: 5px;">' +
    '<button class="btn-inline"'+
    ' data-action="saveEventDefinition">'+titleApply+'</button>' +
    '</div>',

    get: function (element, propertyNode) {
      var valor = '';
      if (!isUndefined(element.businessObject.conditionPemwork)){
        valor = element.businessObject.conditionPemwork;
        // procesa el valor para llenar los combos
        var processVariableOperator = valor.match(/[=<>!]{1,2}|\.isTrue|\.isFalse/)[0];
        var partes = valor.split(processVariableOperator);
        var processVariable = partes[0];
        var processVariableValue = partes[1];

        // console.log(valor);
        // console.log(processVariableOperator);
        // console.log(partes);
        // console.log(processVariable);
        // console.log(processVariableValue);
        setTimeout(function(){
          var procVarCombo = domQuery('select[name=processvariable]', propertyNode);
          forEach(procVarCombo.children, function(option){
            if (processVariable === option.value) {
              domAttr(option, 'selected', 'selected');
            } else {
              domAttr(option, 'selected', null);
            }
          });

          var operatorCombo = domQuery('select[name=selectCondition]', propertyNode);
          forEach(operatorCombo.children, function(option){
            if (processVariableOperator === option.value) {
              domAttr(option, 'selected', 'selected');
            } else {
              domAttr(option, 'selected', null);
            }
          });

          var procVarType = '';
          forEach(formData[0].fields, function (option) {
            if(option.id==processVariable){
              procVarType=option.type;
            }
          });
          var CondPanel = domQuery('[id=CondPanel]', propertyNode);
          if(procVarType == 'File' ) {
            //domClasses(CondPanel).add(constants.HIDE_CLASS);
          }
          else if(procVarType == 'Double' ) {
            domClasses(CondPanel).remove(constants.HIDE_CLASS);
          }
          else if(procVarType == 'Boolean' ) {
            //domClasses(CondPanel).add(constants.HIDE_CLASS);
          }
          else if(procVarType == 'String' ) {
            domClasses(CondPanel).remove(constants.HIDE_CLASS);
          }

          domQuery('[name=conditionEventDefinition]').value = ''+processVariableValue;
        }, 100);
      }
      return {
        'conditionPemwork': valor
      };
    },
    set: function (element, values, containerElement) {
      var newProperties = {
        conditionPemwork: values.conditionPemwork
      };
      return cmdHelper.updateBusinessObject(element.businessObject,
          element.businessObject, newProperties);
    },

    updateEventDefinitionForm: function (element, propertyNode, event) {
      var  processvariable;
      processvariable = domQuery('select[name=processvariable]', propertyNode).value;
      var type1="";
      forEach(formData[0].fields, function (option) {
        if(option.id==processvariable){
          type1=option.type;
        }
      });

      var  optionsProcessToEnable = {};
      var  firstEnabledOption = null;
      var CondPanel = domQuery('[id=CondPanel]', propertyNode);
      if(type1 == 'File' ) {

        optionsProcessToEnable['.fileExist'] = '.fileExist';
        //domQuery('[name=conditionEventDefinition]', propertyNode).value ="";
        domClasses(CondPanel).add(constants.HIDE_CLASS);

      }
      else if(type1 == 'Double' ) {

        optionsProcessToEnable['=='] = '==';
        optionsProcessToEnable['!='] = '!=';
        optionsProcessToEnable['<'] = '<';
        optionsProcessToEnable['>'] = '>';
        optionsProcessToEnable['<='] = '<=';
        optionsProcessToEnable['>='] = '>=';
        //domQuery('[name=conditionEventDefinition]', propertyNode).value ="";
        domClasses(CondPanel).remove(constants.HIDE_CLASS);

      }
      else if(type1 == 'Boolean' ) {

        optionsProcessToEnable['.isTrue'] = '.isTrue';
        optionsProcessToEnable['.isFalse'] = '.isFalse';
        //domQuery('[name=conditionEventDefinition]', propertyNode).value ="";
        domClasses(CondPanel).add(constants.HIDE_CLASS);
      }
      else if(type1 == 'String' ) {
        optionsProcessToEnable['=='] = '==';
        optionsProcessToEnable['!='] = '!=';
        //domQuery('[name=conditionEventDefinition]', propertyNode).value ="";
        domClasses(CondPanel).remove(constants.HIDE_CLASS);


      }

      var selectCondition = domQuery('select[name=selectCondition]', propertyNode);

      // update the state of selectCondition
      forEach(selectCondition.children, function (option) {

        option.disabled = !has(optionsProcessToEnable, option.value);

        if (option.disabled && selectCondition.value == option.value) {
          // un-select disabled elements
          domAttr(option, 'selected', null);
        } else if (!option.disabled && selectCondition.value == option.value) {
          // select enabled (and selected) elements
          domAttr(option, 'selected', 'selected');
        }
        if (!firstEnabledOption && !option.disabled) {
            firstEnabledOption = option;
        }
      });
      if (!has(optionsProcessToEnable, selectCondition.value)) {
        // select the first enabled item
        domAttr(firstEnabledOption, 'selected', 'selected');
      }
      console.log(type1);
    },
    saveEventDefinition: function (element, propertyNode, event) {
      var  processvariableSave = domQuery('select[name=processvariable]', propertyNode).value,
          conditionsave=domQuery('select[name=selectCondition]', propertyNode).value,
          valtxt=domQuery('[name=conditionEventDefinition]', propertyNode).value;
      var typevar="",vResult="";
      forEach(formData[0].fields, function (option) {
        if(option.id==processvariableSave){
          typevar=option.type;
        }

      });

      if(typevar == 'File'||typevar == 'Boolean' ) {
        vResult=processvariableSave+conditionsave;

      }
      else if(typevar == 'Double' ) {
        vResult=processvariableSave+conditionsave+valtxt;

      }
      else if(typevar == 'String' ) {

        vResult=processvariableSave+conditionsave+valtxt;

      }
      console.log(vResult);
      // save the string to the input element
      domQuery('input[name=conditionPemwork]', propertyNode).value = vResult;

      return true;
    },

    cssClasses: ['pp-textfield']
  });
}

module.exports = SequenceFlowDefinition;
