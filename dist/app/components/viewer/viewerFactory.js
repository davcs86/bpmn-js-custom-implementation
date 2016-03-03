(function() {
  'use strict';
  angular.module('custom-bpmnjs')
    .factory('viewerFactory', viewerFactory);

  viewerFactory.$inject = ['$rootScope', 'diagramFactory', 'Viewer', '$q', '$translate'];

  function viewerFactory($rootScope, diagramFactory, Viewer, $q, $translate) {
    var viewer = function() {
      var bpmnJS,
          that = this;
      $rootScope.$on('$stateChangeSuccess', function(){
        that.create(true);
      });
      $rootScope.$on('diagramImported', function(){
        that.loadFromDiagramFactory();
      });
      $rootScope.$on('$translateChangeEnd', function () {
        //$timeout(function () {
        that.bpmnJS.get('translate').applyLanguage();
        //});
      });
      this.create();
    };
    viewer.prototype.translator = function(str, args){
      return $translate.instant(str, args);
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
      var diagram = diagramFactory.get(),
          that = this;
      this.bpmnJS.importXML(diagram, function(err){
        if (err) {
          return;
        }
        // set the translation function
        that.bpmnJS.get('translate').t = that.translator;
      });
    };
    viewer.prototype.downloadXML = function() {
      console.log("Download");
      this.bpmnJS.saveXML();
    };
    return new viewer();
  }
})();
