(function() {
  angular.module('clockApp')
    .directive("colorOption", function($window) {

      return {
        restrict : 'EA',
        replace : true,
        link: function(scope, element, attr) {

          element.on('click', function (event) {
            scope.app.setAppColor(attr.color);
            element.parent().parent().find("color-option").removeClass('selected');
            element.addClass('selected');
            scope.$apply();
          });

        }
      }; //end return
    }); //end directive

})();