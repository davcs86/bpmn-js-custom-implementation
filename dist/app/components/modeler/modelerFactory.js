(function() {
  'use strict';
  angular.module('custom-bpmnjs')
    .factory('modelerFactory', modelerFactory);

  modelerFactory.$inject = ['$rootScope', 'diagramFactory', 'Modeler', 'PropertiesProviders', '$translate'];

  function modelerFactory($rootScope, diagramFactory, Modeler, PropertiesProviders, $translate) {
    function modeler() {
      var bpmnJS,
          that = this;
      $rootScope.$on('$stateChangeSuccess', function(){
        that.create(true);
      });
      $rootScope.$on('diagramImported', function(){
         that.loadFromDiagramFactory();
      });
      $rootScope.$on('$translateChangeEnd', function (evt, params) {
        that.bpmnJS.get('i18nextHelper').changeLanguage(params.language);
      });
      this.create();
    };
    modeler.prototype.setCurrentProviderName = function(providerName) {
      PropertiesProviders.current = providerName;
    };
    modeler.prototype.getProviders = function() {
      return PropertiesProviders.providers;
    };
    modeler.prototype.getCurrentProviderName = function() {
      return PropertiesProviders.current;
    };
    modeler.prototype.getCurrentProvider = function() {
      return this.getProviders()[this.getCurrentProviderName()];
    };
    modeler.prototype.changeProvider = function(newProvider){
      if (angular.isDefined(this.getProviders()[newProvider])){
        this.setCurrentProviderName(newProvider);
        this.updatePropertiesPanel();
      }
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
      //this.bpmnJS.definitions.set('xmlns:di_1', 'http://www.omg.org/spec/DD/20100524/DI');
      this.bpmnJS.createDiagram(function(err, warnings){
        console.log(that);
        console.log(arguments);
        if(err){
          console.log(warnings);
        }
      });
      this.loadFromDiagramFactory();
    };
    modeler.prototype.updatePropertiesPanel = function(){
      var eventBus = this.bpmnJS.get('eventBus'),
          bpmnFactory = this.bpmnJS.get('bpmnFactory'),
          elementRegistry = this.bpmnJS.get('elementRegistry'),
          translate = this.bpmnJS.get('translate'),
          propertiesProvider = this.getCurrentProvider();
      this.bpmnJS.options.additionalModules[0] = propertiesProvider;
      this.bpmnJS.get('propertiesPanel')._propertiesProvider = new propertiesProvider.propertiesProvider[1](eventBus, bpmnFactory, elementRegistry, translate);
      this.bpmnJS.get('propertiesPanel').update(this.bpmnJS.get('propertiesPanel')._current.element);
    };
    modeler.prototype.loadFromDiagramFactory = function(){
      // assumes it's correct
      var that = this;
      this.bpmnJS.importXML(diagramFactory.get(), function(err, warnings){
        console.log(that);
        if(err){
          console.log(warnings);
        }
      });
    };
    return new modeler();
  }
})();
