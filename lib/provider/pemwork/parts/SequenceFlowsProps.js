/**
 * Created by Desarrollo on 14/03/2016.
 */
'use strict';

//var entryFactory = require('../factory/EntryFactory');
var domQuery = require('min-dom/lib/query');
//var domClasses = require('min-dom/lib/classes'),
   //domAttr = require('min-dom/lib/attr');
// lodash imports
var   forEach = require('lodash/collection').forEach,
    isUndefined = require('lodash/lang').isUndefined,
  // has = require('lodash/object').has,
   // toSafeInteger = require('lodash/lang').toSafeInteger,
// bpmn-js imports
    is = require('bpmn-js/lib/util/ModelUtil').is;
 //   elementHelper = require('bpmn-js-properties-panel/lib/helper/ElementHelper'),
   // cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper'),
// local imports
   // timerDefinitionHelper = require('../../helper/TimerEventDefinition'),
  //  constants = require('../../helper/Constants'),
// third party imports
 //   moment = require('moment'),
  //  Pikaday = require('pikaday-time'),
  //  MultiSelectDropdown = require('multi-select-dropdown');
var  getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject,
    getExtensionElements = require('../helper/ExtensionElementsHelper').getExtensionElements;


function SequenceFlowsProps(group, element,bpmnFactory, elementRegistry, translate) {
    if(is(element, 'bpmn:SequenceFlow') && (
            is(element.source,'bpmn:ExclusiveGateway') ||
            is(element.source,'bpmn:InclusiveGateway') //||
            //is(element.source,'bpmn:ParallelGateway')
        )
    ) {
        var root = elementRegistry.getAll()[0];
        var bo = getBusinessObject(root),
            formData = getExtensionElements(bo, 'pemwork:FormData');

        var OptionHTML;
        if (!isUndefined(formData) && !isUndefined(formData[0]) && !isUndefined(formData[0].fields)) {

            forEach(formData[0].fields, function (option) {
                OptionHTML += '<option value="' + option.id + '">' + option.id + '</option>';
            });

            //formData[0].fields.forEach(function(entry) {
            //    console.log(entry.id);
            //});
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
            '<select id="pemwork-processvariable" name="processvariable"' +
            ' data-on-change="updateTimerEventDefinitionForm">' +
            '  <option value="">-------</option>' +
            OptionHTML +
            '</select>' +
            '<div>' +
            '<label  for="conditionType">'+titleCond+'</label>'+
            '<select name="selectCondition" data-on-change="updateTimerEventDefinitionForm"'+
            '">' +
            '  <option value="">-------</option>' +
            '  <option value="==">==</option>'+
            '  <option value="!=">!=</option>'+
            '  <option value="<">&lt;</option>'+
            '  <option value=">"> &gt;</option>'+
            '  <option value="<=">&lt;=</option>'+
            '  <option value=">=">&gt;=</option>'+
            '  <option value=".fileExist">File exist</option>'+
            '  <option value=".isTrue">is True</option>'+
            '  <option value=".isFalse">is True</option>'+
            '</select>'+
            '</div>'+
            '<div id="repetitionsPanel" style="margin-left:5px; margin-top: 5px;" >' +
            '<label  for="conditionValue">'+titleVal+'</label>'+
            /*'<input type="text" class="text-center width-120px padding-right-6px" ' +
            ' name="valuecond">' +*/
            '</div>'+
                '<div style="margin-left:5px; margin-top: 5px;">' +
                '<button class="btn-inline"'+
                ' data-action="saveTimerEventDefinition">'+titleApply+'</button>' +
                '</div>',

            get: function (element, propertyNode) {

            },
            set: function (element, values, containerElement) {

            },

            updateTimerEventDefinitionForm: function (element, propertyNode, event) {
                var  timerEventDefinitionTypeValue;
                timerEventDefinitionTypeValue = domQuery('select[name=processvariable]', propertyNode).value;
                console.log(timerEventDefinitionTypeValue);
                var type1="";
                forEach(formData[0].fields, function (option) {
                    if(option.id==timerEventDefinitionTypeValue){
                        type1=option.type;

                    }

                });
        /*   var selectTimerCycleType = domQuery('select[name=selectCondition]', propertyNode);
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
                          //  firstEnabledOption = option;
                        }
                    });
                    if (!has(optionsTimerCycleTypeToEnable, selectTimerCycleType.value)) {
                        // select the first enabled item
                        domAttr(firstEnabledOption, 'selected', 'selected');
                    }}*/
                console.log(type1);
            },
            saveTimerEventDefinition: function (element, propertyNode, event) {

            },

            cssClasses: ['pp-textfield']
        });
    }
}

module.exports = SequenceFlowsProps;