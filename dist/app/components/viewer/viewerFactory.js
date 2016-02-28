(function() {
  'use strict';
  angular.module('custom-bpmnjs')
    .factory('viewerFactory', viewerFactory);

  viewerFactory.$inject = ['$rootScope', 'diagramFactory'];

  function viewerFactory($rootScope, diagramFactory) {
    var viewer = function() {
      var bpmnJs = new window.BPMNJS_Custom();
      $rootScope.$on('diagramSaved', function() {
        bpmnJs.importXML(diagramFactory.get(), function(err, diagram) {
          // TODO: Implement it
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
    return viewer;
  }
})();
