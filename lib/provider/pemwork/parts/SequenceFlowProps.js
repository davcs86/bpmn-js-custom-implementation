/**
 * Created by Desarrollo on 14/03/2016.
 */
'use strict';

var is = require('bpmn-js/lib/util/ModelUtil').is,
    cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper'),
    elementHelper = require('bpmn-js-properties-panel/lib/helper/ElementHelper'),
    isUndefined = require('lodash/lang').isUndefined,
    entryFactory = require('../factory/EntryFactory');

module.exports = function(group, element, bpmnFactory, translate) {

    if(is(element, 'bpmn:SequenceFlow') && (
            is(element.source,'bpmn:ExclusiveGateway') ||
            is(element.source,'bpmn:InclusiveGateway') //||
            //is(element.source,'bpmn:ParallelGateway')
        )
    ) {
        group.entries.push(entryFactory.textField({
            id : 'condition',
            description : translate('Condition'),
            label : translate('Condition'),
            modelProperty : 'condition-pemwork',
            get: function(element, node){
                var valor = '';
                if (isUndefined(element.businessObject.conditionExpression)){
                    element.businessObject.conditionExpression = null;
                } else {
                    valor = element.businessObject.conditionExpression.body;
                }
                return {
                    'condition-pemwork': valor
                };
            },
            set: function(element, values){
                var newValue = {
                    'conditionExpression': elementHelper.createElement(
                            'bpmn:FormalExpression',
                            { body: values['condition-pemwork'] },
                            element.businessObject,
                            bpmnFactory
                        )
                };

                return cmdHelper.updateBusinessObject(element, element.businessObject, newValue);
            }
        }));
    }
};