(function(){
  angular
    .module('clockApp', ['ngMaterial', 'ngRoute'])
    .config(function($mdThemingProvider, $mdIconProvider, $routeProvider, $logProvider){
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

      $logProvider.debugEnabled(true);
    })
    .factory('colorMap', function() {
      var colorMap = {
        "red" : {
          web : { r: 244, g: 67, b: 54 },
          led : { r: 4095, g: 0, b: 0 }
        },
        "pink" : {
          web : { r: 233, g: 30, b: 99 },
          led : { r: 4095, g: 0, b: 1000 }
        },
        "purple" : {
          web : { r: 156, g: 39, b: 176 },
          led : { r: 3000, g: 0, b: 4095 }
        },
        "blue" : {
          web : { r: 33, g: 110, b: 243 },
          led : { r: 0, g: 0, b: 4095 }
        },
        "light-blue" : {
          web : { r: 3, g: 169, b: 244 },
          led : { r: 0, g: 1500, b: 4095 }
        },
        "green" : {
          web : { r: 76, g: 175, b: 80 },
          led : { r: 0, g: 4095, b: 0 }
        },
        "lime" : {
          web : { r: 205, g: 220, b: 57 },
          led : { r: 3000, g: 4095, b: 0 }
        },
        "amber" : {
          web : { r: 255,  g: 193, b: 7 },
          led : { r: 4095, g: 2000, b: 0 }
        },
        "orange" : {
          web : { r: 255, g: 152, b: 0 },
          led : { r: 4095, g: 500, b: 0}
        },
        "grey" : {
          web : { r: 158, g: 158, b: 158 },
          led : { r: 0, g: 0, b: 0 }
        }
      };

      function getWebColor (colorKey) {
        return colorMap[colorKey].web;
      }

      function getLedColor (colorKey) {
        return colorMap[colorKey].led;
      }

      function getColorKey (r, g, b) {
        var color = "grey";
        angular.forEach(colorMap, function(value, key) {
          if (value.web.r == r && value.web.g == g && value.web.b == b) {
            color = key;
          } else if (value.led.r == r && value.led.g == g && value.led.b == b) {
            color = key;
          }
        });

        return color;
      }

      return {
        getWebColor: getWebColor,
        getLedColor: getLedColor,
        getColorKey: getColorKey
      };
    })
    .controller('AppCtrl', ['colorMap', '$mdSidenav', '$mdBottomSheet', '$log',
      AppController
    ]);

  /**
   * Main Controller for the Angular Material Starter App
   * @param $scope
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
  function AppController(colorMap, $mdSidenav, $mdBottomSheet, $log ) {
    var self = this;

    self.toggleList = toggleMenuList;
    self.color = 'red'; //Default color

    self.setAppColor = function (color) {
      self.color = color;
    };


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