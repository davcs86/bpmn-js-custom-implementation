/**
 * Created by Desarrollo on 14/03/2016.
 */
'use strict';

var SequenceFlowDefinition = require('./implementation/SequenceFlowDefinition'),
    is = require('bpmn-js/lib/util/ModelUtil').is;
function SequenceFlowsProps(group, element,bpmnFactory, elementRegistry, translate) {
    if(is(element, 'bpmn:SequenceFlow') && (
            is(element.source,'bpmn:ExclusiveGateway') ||
            is(element.source,'bpmn:InclusiveGateway') //||
            //is(element.source,'bpmn:ParallelGateway')
        )
    ) {

        SequenceFlowDefinition(group, element, bpmnFactory, elementRegistry, translate);
    }
}

module.exports = SequenceFlowsProps;