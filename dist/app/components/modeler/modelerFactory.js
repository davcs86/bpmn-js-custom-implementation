(function() {
  'use strict';
  angular.module('custom-bpmnjs')
    .factory('modelerFactory', modelerFactory);

  modelerFactory.$inject = ['$rootScope', 'diagramFactory', 'Modeler', 'bpmnProvider', 'camundaProvider', 'customProvider'];

  function modelerFactory($rootScope, diagramFactory, Modeler, bpmnProvider, camundaProvider, customProvider) {
    function modeler() {
      var bpmnJS,
          that = this,
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
          that.updatePropertiesPanel();
        }
      };
      $rootScope.$on('$stateChangeSuccess', function(){
        that.create(true);
      });
      $rootScope.$on('diagramImported', function(){
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
    modeler.prototype.save = function() {
      this.bpmnJS.saveXML(function(err, xml){
        if(err) {
          return;
        }
        diagramFactory.save(xml);
      });
    };
    modeler.prototype.create = function(overwrite){
      if (!!overwrite){
        this.bpmnJS.destroy();
      }
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
      this.loadFromDiagramFactory();
    };
    modeler.prototype.updatePropertiesPanel = function(){
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
