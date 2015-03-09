(function() {
  angular.module('clockApp')
    .directive("colorOption", function($window) {

      return {
        restrict : 'EA',
        replace : true,
        link: function(scope, element, attr) {

          element.on('click', function (event) {
            scope.app.setColor(attr.color);
            scope.$apply();
          });

          scope.$watch('app.color', function(newColor) {
              if (newColor === attr.color) {
                element.addClass('selected');
              } else {
                element.removeClass('selected');
              }

          });

        }
      }; //end return
    }); //end directive

})();