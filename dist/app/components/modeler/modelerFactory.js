(function() {
  'use strict';
  angular.module('custom-bpmnjs')
    .factory('modelerFactory', modelerFactory);

  modelerFactory.$inject = ['$rootScope', 'diagramFactory', 'Modeler', 'bpmnProvider', 'camundaProvider', 'customProvider'];

  function modelerFactory($rootScope, diagramFactory, Modeler, bpmnProvider, camundaProvider, customProvider) {
    function modeler() {
      var bpmnJS,
          that = this,
          isDirty = false,
          providerList = {
            currentName: 'Custom',
              providers: {
                'BPMN 2.0': bpmnProvider,
                'Camunda': camundaProvider,
                'Custom': customProvider
            }
          },
          setCurrentProviderName = function(providerName) {
            providerList.currentName = providerName;
          };
      this.getProviders = function() {
        return providerList.providers;
      };
      this.getCurrentProviderName = function() {
        return providerList.currentName;
      };
      this.getCurrentProvider = function() {
        return that.getProviders()[that.getCurrentProviderName()];
      };
      this.changeProvider = function(newProvider){
        if (angular.isDefined(that.getProviders()[newProvider])){
          setCurrentProviderName(newProvider);
          that.updatePanelProvider();
        }
      };
      $rootScope.$on('diagramSaved', function () {
        that.loadFromDiagramFactory();
      });
      this.create();
    };
    modeler.prototype.get = function() {
      return this.bpmnJS;
    };
    modeler.prototype.downloadXML = function() {
      this.bpmnJS.saveXML();
    };
    modeler.prototype.create = function(){
      var that = this;
      this.bpmnJS = new Modeler({
        container: '#modeler-canvas',
        propertiesPanel: {
          parent: '#modeler-properties-panel'
        },
        additionalModules: [
          that.getCurrentProvider()
        ]
      });
      this.bpmnJS.createDiagram(angular.noop);
      this.bpmnJS.on('elements.changed', function() {
         that.isDirty = true;
         console.log('ELEMENTS CHANGED');
      });
      this.loadFromDiagramFactory();
    };
    modeler.prototype.updatePanelProvider = function(){

      var eventBus = this.bpmnJS.get('eventBus'),
          bpmnFactory = this.bpmnJS.get('bpmnFactory'),
          elementRegistry = this.bpmnJS.get('elementRegistry'),
          propertiesProvider = this.getCurrentProvider();
      this.bpmnJS.options.additionalModules[0] = propertiesProvider;
      this.bpmnJS.get('propertiesPanel')._propertiesProvider = new propertiesProvider.propertiesProvider[1](eventBus, bpmnFactory, elementRegistry);
      this.bpmnJS.get('propertiesPanel').update(this.bpmnJS.get('propertiesPanel')._current.element);
    };
    modeler.prototype.loadFromDiagramFactory = function(){
      // assumes it's correct
      this.bpmnJS.importXML(diagramFactory.get(), angular.noop);
    };
    return new modeler();
  }
})();
