(function() {
  'use strict';
  angular.module('custom-bpmnjs')
    .factory('diagramFactory', diagramFactory);

  diagramFactory.$inject = ['$rootScope', '$localStorage', 'diagramImporterFactory', 'spinnerFactory'];

  function diagramFactory($rootScope, $localStorage, diagramImporterFactory, spinnerFactory) {
    function diagram() {
      $rootScope.$on('notifyErrors', function(evt, args){
         console.log(args);
      });
    };
    diagram.prototype.$storage = $localStorage.$default({diagram:  '<?xml version="1.0" encoding="UTF-8"?><bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" targetNamespace="http://bpmn.io/schema/bpmn" id="Definitions_1"><bpmn:process id="Process_1" isExecutable="false"><bpmn:startEvent id="StartEvent_1"/></bpmn:process><bpmndi:BPMNDiagram id="BPMNDiagram_1"><bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1"><bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1"><dc:Bounds height="36.0" width="36.0" x="173.0" y="102.0"/></bpmndi:BPMNShape></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn:definitions>'});
    diagram.prototype.get = function() {
      return this.$storage.diagram;
    };
    diagram.prototype.save = function(diagram) {
      this.$storage.diagram = diagram;
    };
    diagram.prototype.import = function(diagram) {
      // test if it's well defined
      spinnerFactory.show();
      var that = this;
      diagramImporterFactory.importXML(diagram)
        .then(
          function() {
            // save the diagram
            that.save(diagram);
            $rootScope.$emit('diagramImported');
          })
        .catch(
          function(warnings) {
            $rootScope.$emit('notifyErrors', {errors: warnings});
          })
        .finally(function() {
          spinnerFactory.hide();
        });
    };
    return new diagram();
  }
})();
