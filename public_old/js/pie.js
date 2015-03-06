Raphael.fn.pieChart = function (cx, cy, r) {
    var values = [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30];
    var labels = [3, 2, 1, 12, 11, 10, 9, 8, 7, 6, 5, 4];
    var stroke = "#fff";
    var paper = this,
        sectorList = paper.set(),
        chart = this.set(),
        rad = Math.PI / 180;

    function sector(cx, cy, r, startAngle, endAngle, params) {
        var x1 = cx + r * Math.cos(-startAngle * rad),
            x2 = cx + r * Math.cos(-endAngle * rad),
            y1 = cy + r * Math.sin(-startAngle * rad),
            y2 = cy + r * Math.sin(-endAngle * rad);
        return paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
    }

    var angle = 0;
    var total = 0;
    var start = 0;
    var process = function (j) {
        var value = values[j],
            angleplus = 360 * value / total,
            popangle = angle + (angleplus / 2),
            color = Raphael.hsb(start, .75, 1),
            ms = 250,
            delta = 15,
            bcolor = Raphael.hsb(start, 1, 1),
            p = sector(cx, cy, r, angle, angle + angleplus, {fill: "90-" + bcolor + "-" + color, stroke: stroke, "stroke-width": 3});
            //txt = paper.text(cx + (r + delta + 55) * Math.cos(-popangle * rad), cy + (r + delta + 25) * Math.sin(-popangle * rad), labels[j]).attr({fill: "#fff", stroke: "none", opacity: 1, "font-size": 20});


        p.click(function(){
            sectorList.stop().animate({transform: ""}, ms);
            p.stop().animate({transform: "s1.1 1.1 " + cx + " " + cy}, ms);
        });

        angle += angleplus;
        chart.push(p);
        sectorList.push(p);
        start += .08;
    };

    for (var i = 0, ii = values.length; i < ii; i++) {
        total += values[i];
    }
    for (i = 0; i < ii; i++) {
        process(i);
    }
    return chart;
};
/*
$(function(){
    var size = 700;
    var radius = (size / 2) - 50;
    var values = [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30];
    var labels = [3, 2, 1, 12, 11, 10, 9, 8, 7, 6, 5, 4];

    console.log(size, radius);
    Raphael('holder', size, size).pieChart(size/2, size/2, radius);
});
*/

