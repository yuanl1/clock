(function() {
  angular.module('clockApp')
  	.controller('CommandCenterCtrl', ['$log',
      CommandCenterController
    ]);

  function CommandCenterController($log) {
  	var self = this;


  	self.ledColor = {
      r: 0,
      g: 0,
      b: 0
    };

    self.webColor = {
      r: 0,
      g: 0,
      b: 0
    };

  }

})();