(function(){
  angular.module('clockApp')
    .service('clockService', function($http, $window, $log){
      var baseUrl = window.location.href;
      return {
        getCurrentLights : function(callback){
          var url = baseUrl + "api/current_lights/";
          $log.debug('request: ' + url);
          $http.get(url).success(function(data){
          $log.debug(data);
            callback(data);
          });
        },

        send : function(id, r, g, b){
          //url: http://www.chillspotclock.com/api/light_led?light_number=0&r=1000&g=0&b=0&time=5000
          var params = {
            light_number : id,
            r : r,
            g : g,
            b : b,
            time : 0
          };

          $http({method: 'GET', url: '/api/light_led', params: params})
            .success( function (data) {
              $log.debug(data);
            });
        }
      }; //return
    }); //service

})();