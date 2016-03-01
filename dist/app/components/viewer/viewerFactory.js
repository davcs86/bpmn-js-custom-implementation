(function() {
  'use strict';
  angular.module('custom-bpmnjs')
    .factory('viewerFactory', viewerFactory);

  viewerFactory.$inject = ['$rootScope', 'diagramFactory', 'Viewer'];

  function viewerFactory($rootScope, diagramFactory, Viewer) {
    var viewer = function() {
      var bpmnJS,
          that = this;
      $rootScope.$on('diagramSaved', function () {
        that.loadFromDiagramFactory();
      });
      this.create();
    };
    viewer.prototype.create = function() {
      this.bpmnJs = new Viewer({
        container: '#viewer-canvas'
      });
      // assumes it's correct
       this.loadFromDiagramFactory();
    }
    viewer.prototype.loadFromDiagramFactory = function(){
      // assumes it's correct
      this.bpmnJS.importXML(diagramFactory.get(), angular.noop);
    };
    viewer.prototype.downloadXML = function() {
      console.log("Download");
      this.bpmnJS.saveXML();
    };
    return new viewer();
  }
})();
