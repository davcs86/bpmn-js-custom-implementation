(function() {
  'use strict';
  angular.module('custom-bpmnjs')
    .factory('viewerFactory', viewerFactory);

  viewerFactory.$inject = ['$rootScope', 'diagramFactory', 'Viewer'];

  function viewerFactory($rootScope, diagramFactory, Viewer) {
    var viewer = function() {
      var bpmnJs = new Viewer({
        container: '#viewer-canvas'
      });
      $rootScope.$on('diagramSaved', function() {
        bpmnJs.importXML(diagramFactory.get(), function(err, diagram) {
          console.log('TODO: Implement it');
        });
      });
      return {
        get: function () {
          return bpmnJs;
        },
        downloadXML: function () {
          bpmnJs.saveXML();
        }
      }
    };
    return new viewer();
  }
})();
