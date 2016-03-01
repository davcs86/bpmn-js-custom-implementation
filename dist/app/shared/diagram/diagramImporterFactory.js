(function() {
  'use strict';
  angular.module('custom-bpmnjs')
    .factory('diagramImporterFactory', diagramImporterFactory);

  diagramImporterFactory.$inject = ['$q', 'Viewer'];

  function diagramImporterFactory($q, Viewer) {
    function diagramImporter() {
    };
    diagramImporter.prototype.importXML = function (xml) {
      /*
       * Create a hidden viewer, and try to import the xml in it
       */
      var pseudoRandomId = 'viewer_' + Math.random().toString(36).substring(7),
        viewerContainerWrap = document.createDocumentFragment(),
        viewerContainer = document.createElement('div'),
        defer = $q.defer(),
        viewer;

      viewerContainer.id = pseudoRandomId;
      viewerContainerWrap.appendChild(viewerContainer);
      viewer = new Viewer({
        container: viewerContainer
      });
      viewer.importXML(xml, function (err) {
        // destroy the viewer
        viewer.destroy();
        // notify the results
        if (err) {
          defer.reject(err);
        } else {
          defer.resolve();
        }
      });
      return defer.promise;
    };
    return new diagramImporter();
  }
})();
