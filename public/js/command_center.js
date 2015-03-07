(function() {
  angular.module('clockApp')
  	.controller('CommandCenterCtrl', ['$log',
      CommandCenterController
    ]);

  function CommandCenterController($log) {
  	var self = this;
  	self.name = "Command Center"

  }

})();