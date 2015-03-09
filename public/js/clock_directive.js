(function() {
  angular.module('clockApp')
    .directive("clock", function($window) {


      function sector(paper, cx, cy, r, startAngle, endAngle, params) {
        var rad = Math.PI / 180,
            x1 = cx + r * Math.cos(-startAngle * rad),
            x2 = cx + r * Math.cos(-endAngle * rad),
            y1 = cy + r * Math.sin(-startAngle * rad),
            y2 = cy + r * Math.sin(-endAngle * rad);
        return paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
      }

      return {
        restrict : 'EA',
        replace : true,
        link: function(scope, element, attr){
          var sectorAngles = [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
              size = 600,
              cx = size/2,
              cy = size/2,
              r = (size/2),
              angle = 0,
              paper = $window.Raphael(element[0]),
              clock = paper.set(),
              sectors = [],
              params = {
                "fill": "#9e9e9e",
                "stroke": "#ffffff",
                "stroke-width": 3
              };

          paper.setViewBox(0,0,size,size,true);
          paper.setSize('100%', '100%');

          sectorAngles.forEach(function(anglePlus, index) {
            var sect = sector(paper, cx, cy, r, angle, angle + anglePlus, params);
            sectors.push(sect);
            clock.push(sect);

            angle = angle + anglePlus;
          });

        }
      }; //end return
    }); //end directive

})();