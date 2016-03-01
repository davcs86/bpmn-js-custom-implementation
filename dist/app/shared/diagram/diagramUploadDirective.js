(function() {
  'use strict';
  /**
   * Simple directive to read as text a selected file
   * @params {object}
   */
  angular
    .module('custom-bpmnjs')
    .directive('diagramUpload', diagramUpload);

  diagramUpload.$inject = ['diagramFactory'];

  function diagramUpload(diagramFactory) {
    var directive = {
      link: link,
      restrict: 'A'
    };
    return directive;

    function link(scope, element, attrs) {
      var diagram = diagramFactory;
      var processFile = function(file){
        var reader = new FileReader();
        reader.onload = function (e) {
          diagram.import(e.target.result);
        };
        console.log(file);
        reader.readAsText(file);
      };
      element.bind('change', function(){
        [].forEach.call(event.target.files, processFile);
      });
    }
  }

})();