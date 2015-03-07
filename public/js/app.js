(function(){
  angular
    .module('clockApp', ['ngMaterial'])
    .config(function($mdThemingProvider){
            $mdThemingProvider.theme('default')
                .primaryPalette('brown')
                .accentPalette('red');
    })
    .controller('ClockCtrl', ['$mdSidenav', '$mdBottomSheet', '$log',
      ClockController
    ]);

  /**
   * Main Controller for the Angular Material Starter App
   * @param $scope
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
  function ClockController($mdSidenav, $mdBottomSheet, $log ) {
    var self = this;

    self.title = "Angular Material - Starter App"


    // *********************************
    // Internal methods
    // *********************************

    /**
     * Hide or Show the 'left' sideNav area
     */
    function toggleUsersList() {
      $mdSidenav('left').toggle();
    }

    /**
     * Select the current avatars
     * @param menuId
     */
    function selectUser ( user ) {
      self.selected = angular.isNumber(user) ? $scope.users[user] : user;
      self.toggleList();
    }

    /**
     * Show the bottom sheet
     */
    function share($event) {
        var user = self.selected;

        $mdBottomSheet.show({
          parent: angular.element(document.getElementById('content')),
          templateUrl: '/src/users/view/contactSheet.html',
          controller: [ '$mdBottomSheet', UserSheetController],
          controllerAs: "vm",
          bindToController : true,
          targetEvent: $event
        }).then(function(clickedItem) {
          $log.debug( clickedItem.name + ' clicked!');
        });

        /**
         * Bottom Sheet controller for the Avatar Actions
         */
        function UserSheetController( $mdBottomSheet ) {
          this.user = user;
          this.items = [
            { name: 'Phone'       , icon: 'phone'       },
            { name: 'Twitter'     , icon: 'twitter'     },
            { name: 'Google+'     , icon: 'google_plus' },
            { name: 'Hangout'     , icon: 'hangouts'    }
          ];
          this.performAction = function(action) {
            $mdBottomSheet.hide(action);
          };
        }
    }

  }

})();