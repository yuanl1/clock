(function(){
  angular
    .module('clockApp', ['ngMaterial', 'ngRoute'])
    .config(function($mdThemingProvider, $mdIconProvider, $routeProvider){
      $mdIconProvider
        .icon("menu", "../img/ic_menu_24px.svg")
        .icon("home", "../img/ic_home_24px.svg")
        .icon("clock", "../img/ic_access_time_24px.svg")
        .icon("favorite", "../img/ic_favorite_24px.svg")
        .icon("settings", "../img/ic_settings_24px.svg");

      $mdThemingProvider.alwaysWatchTheme(true);

      $mdThemingProvider.theme('red')
        .primaryPalette('red')
        .accentPalette('green');
      $mdThemingProvider.theme('pink')
        .primaryPalette('pink')
        .accentPalette('lime');
      $mdThemingProvider.theme('purple')
        .primaryPalette('purple')
        .accentPalette('amber');
      $mdThemingProvider.theme('blue')
        .primaryPalette('blue')
        .accentPalette('orange');
      $mdThemingProvider.theme('light-blue')
        .primaryPalette('light-blue')
        .accentPalette('grey');
      $mdThemingProvider.theme('green')
        .primaryPalette('green')
        .accentPalette('red');
      $mdThemingProvider.theme('lime')
        .primaryPalette('lime')
        .accentPalette('pink');
      $mdThemingProvider.theme('amber')
        .primaryPalette('amber')
        .accentPalette('purple');
      $mdThemingProvider.theme('orange')
        .primaryPalette('orange')
        .accentPalette('blue');
      $mdThemingProvider.theme('grey')
        .primaryPalette('grey')
        .accentPalette('light-blue');


      $routeProvider
        .when('/', {templateUrl: 'partials/command_center.html'})
        .when('/saves', {templateUrl: 'partials/favorites.html'});
    })
    .controller('AppCtrl', ['$mdSidenav', '$mdBottomSheet', '$log',
      AppController
    ]);

  /**
   * Main Controller for the Angular Material Starter App
   * @param $scope
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
  function AppController($mdSidenav, $mdBottomSheet, $log ) {
    var self = this;

    self.toggleList = toggleMenuList;
    self.color = 'red'; //Default color

    self.setColor = function (color) {
      self.color = color;
    }


    // *********************************
    // Internal methods
    // *********************************

    /**
     * Hide or Show the 'left' sideNav area
     */
    function toggleMenuList() {
      $mdSidenav('left').toggle();
    }
  }

})();