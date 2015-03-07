(function() {
  angular.module('clockApp')
  	.controller('FavoritesCtrl', ['$log',
      FavoritesController
    ]);

  function FavoritesController($log) {
  	var self = this;
  	self.name = "Favorites"

  }

})();