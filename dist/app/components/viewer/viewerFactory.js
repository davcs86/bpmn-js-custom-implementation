(function() {
  'use strict';
  angular.module('custom-bpmnjs')
    .factory('viewerFactory', viewerFactory);

  viewerFactory.$inject = ['$rootScope', 'diagramFactory', 'Viewer'];

  function viewerFactory($rootScope, diagramFactory, Viewer) {
    var viewer = function() {
      var bpmnJS,
          that = this;
      $rootScope.$on('$stateChangeSuccess', function(){
        that.create(true);
      });
      $rootScope.$on('diagramImported', function(){
        that.loadFromDiagramFactory();
      });
      this.create();
    };
    viewer.prototype.create = function(overwrite) {
      if (!!overwrite){
        this.bpmnJS.destroy();
      }
      this.bpmnJS = new Viewer({
        container: '#viewer-canvas'
      });
      // assumes it's correct
       this.loadFromDiagramFactory();
    };
    viewer.prototype.loadFromDiagramFactory = function(){
      // assumes it's correct
      var diagram = diagramFactory.get();
      this.bpmnJS.importXML(diagram, angular.noop);
    };
    viewer.prototype.downloadXML = function() {
      console.log("Download");
      this.bpmnJS.saveXML();
    };
    return new viewer();
  }
})();
