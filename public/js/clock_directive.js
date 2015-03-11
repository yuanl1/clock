(function() {
  angular.module('clockApp')
    .directive("clock", function(colorMap, clockService, $window) {


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
              sectorIds = [2, 1, 0, 11, 10, 9, 8, 7, 6, 5, 4, 3],
              size = 600,
              cx = size/2,
              cy = size/2,
              r = (size - 40)/2,
              angle = 0,
              ms = 50,
              paper = $window.Raphael(element[0]),
              clock = paper.set(),
              params = {
                "fill": "#9e9e9e",
                "stroke": "#ffffff",
                "stroke-width": 3
              };

          paper.setViewBox(0,0,size,size,true);
          paper.setSize('100%', '100%');

          sectorAngles.forEach(function(anglePlus, index) {
            var sect = sector(paper, cx, cy, r, angle, angle + anglePlus, params);
            sect.data("id", sectorIds[index]);

            sect.click(function(e){
              var webColor = colorMap.getWebColor(scope.app.color);
              var ledColor = colorMap.getLedColor(scope.app.color);
              var hexColor = $window.Raphael.rgb(webColor.r, webColor.g, webColor.b);
              sect.stop().animate({fill: hexColor}, ms);
              clockService.send(sect.data("id"), ledColor.r, ledColor.g, ledColor.b);
            });

            clock.push(sect);
            angle = angle + anglePlus;
          });

          function init (data) {
              clock.forEach( function (sect) {
                  var id = sect.data('id');
                  var ledColor = data[id];
                  var colorKey = colorMap.getColorKey(ledColor.r, ledColor.g, ledColor.b);
                  var webColor = colorMap.getWebColor(colorKey);
                  var hexColor = $window.Raphael.rgb(webColor.r, webColor.g, webColor.b);

                  sect.stop().animate({fill: hexColor}, ms);
              });
          }

          clockService.getCurrentLights(init);

        }
      }; //end return
    }); //end directive

})();