(function(){
    app.service('clockService', function($http, $window){
        var baseUrl = window.location.href;
        return {
            delete : function(scope, callback){
                var url = baseUrl + "api/presets/" + scope.data.id + "/";
                $http.delete(url).success(function(data){
                    callback(data);
                });
            },
            save : function(scope, callback){
                //ensure that the current saved state is not stale
                scope.UpdateCurrentState();

                var url = baseUrl + "api/presets/"
                var postData = {
                    name : scope.data.name,
                    states : scope.data.states,
                    size : scope.data.states.length
                };

                $http.post(url, postData).success(function(data){
                    callback(data);
                });

            },
            getPreset : function(id, callback){
                var url = baseUrl + "api/presets/" + id + "/";
                $http.get(url).success(function(data){
                    console.log(data);
                    callback(data);
                });
            },
            getPresets : function(callback){
                var url = baseUrl + "api/presets/"
                $http.get(url).success(function(data){
                    console.log(data);
                    callback(data);
                });
            },
            getCurrentLights : function(callback){
                var url = baseUrl + "api/current_lights/";
                console.log('sent: ' + url);
                if(window.location.protocol != "file:"){
                    $http.get(url).success(function(data){
                        console.log(data);
                        callback(data);
                    });
                }
            },
            sendAll : function(scope){
                var lightNumbers = [];
                var rVals = [];
                var gVals = [];
                var bVals = [];
                var timeVals = [];

                for(var i = 0; i < 12; i++){
                    var group = scope.data.groups[i];
                    var color = scope.data.groupColors[group];
                    var rgb = $window.Raphael.getRGB(color);
                    var red = rgb.r * 16;
                    var green = rgb.g * 16;
                    var blue = rgb.b * 16;
                    lightNumbers.push(i);
                    rVals.push(red);
                    gVals.push(green);
                    bVals.push(blue);
                    timeVals.push(scope.data.time);
                }

                var url = baseUrl + "api/light_leds?";
                url += $.param({
                    light_number : lightNumbers.join(),
                    r : rVals.join(),
                    g : gVals.join(),
                    b : bVals.join(),
                    time : timeVals.join()
                });

                console.log('sent: ' + url);

                if(window.location.protocol != "file:"){
                    $http.get(url).success(function(data){
                        console.log(data);
                    });
                }

            },
            send : function(scope){
                var color = scope.data.activeColor;
                var rgb = $window.Raphael.getRGB(color);
                var red = rgb.r * 16;
                var green = rgb.g * 16;
                var blue = rgb.b * 16;

                var lightNumbers = [];
                var rVals = [];
                var gVals = [];
                var bVals = [];
                var timeVals = [];

                for(var i = 0; i < 12; i++){
                    //Check if the current sector's group is in active groups
                    if(_.contains(scope.data.activeGroups, scope.data.groups[i])){
                        lightNumbers.push(i);
                        rVals.push(red);
                        gVals.push(green);
                        bVals.push(blue);
                        timeVals.push(scope.data.time);
                    }
                }
                //url: http://192.168.1.101/light_led?light_number=0&r=1000&g=0&b=0&time=5000
                var url = baseUrl + "api/light_leds?";
                url += $.param({
                    light_number : lightNumbers.join(),
                    r : rVals.join(),
                    g : gVals.join(),
                    b : bVals.join(),
                    time : timeVals.join()
                });

                console.log('sent: ' + url);

                if(window.location.protocol != "file:"){
                    $http.get(url).success(function(data){
                        console.log(data);
                    });
                }

            },
            shutdown : function(scope){
                var url = baseUrl + "api/light_leds?";
                url += $.param({
                    light_number : 'ALL',
                    r : 0,
                    g : 0,
                    b : 0,
                    time : scope.data.time
                });

                if(window.location.protocol != "file:"){
                    $http.get(url).success(function(data){
                        console.log(data);
                    });
                }
            }
        }


    });

    app.directive("clock", function($window, clockService){
        var values = [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30];
        var labels = [2, 1, 0, 11, 10, 9, 8, 7, 6, 5, 4, 3];
        var stroke = "#ffffff";
        var rad = Math.PI / 180;
        var total = 360;

        function sector(paper, cx, cy, r, startAngle, endAngle, params) {
            var x1 = cx + r * Math.cos(-startAngle * rad),
                x2 = cx + r * Math.cos(-endAngle * rad),
                y1 = cy + r * Math.sin(-startAngle * rad),
                y2 = cy + r * Math.sin(-endAngle * rad);
            return paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
        }

        return {
            restrict : 'EA',
            replace : true,
            link: function(scope, element, attr){
                var size = attr.size;
                var cx = size/2;
                var cy = size/2;
                var r = (size / 2) - 50;
                var paper = $window.Raphael(element[0], size, size);
                var clock = paper.set();
                var groupSets = {
                    A : paper.set(),
                    B : paper.set(),
                    C : paper.set(),
                    D : paper.set(),
                    E : paper.set(),
                    F : paper.set(),
                    G : paper.set(),
                    H : paper.set(),
                    I : paper.set(),
                    J : paper.set(),
                    K : paper.set(),
                    L : paper.set()
                };

                var angle = 0;

                var process = function(index){
                    var value = values[index],
                        angleplus = 360 * value / total,
                        popangle = angle + (angleplus / 2),
                        color = "#000000",
                        delta = 15,
                        params = {fill: color, stroke: stroke, "stroke-width": 2};

                    var sect = sector(paper, cx, cy, r, angle, angle + angleplus, params);
                    //var txt = paper.text(cx + (r + delta + 55) * Math.cos(-popangle * rad), cy + (r + delta + 25) * Math.sin(-popangle * rad), labels[j]).attr({fill: "#fff", stroke: "none", opacity: 1, "font-size": 20});

                    sect.data('label', labels[index]);

                    sect.click(function(e){
                        var label = sect.data('label');
                        var group = scope.data.groups[label];
                        var groupColor = scope.data.groupColors[group];
                        var groupSet = groupSets[group];

                        scope.$apply(function(){

                            if(e.shiftKey) {
                                if(!_.contains(scope.data.activeGroups, group)) {
                                    scope.data.activeGroups.push(group);
                                }
                            } else {
                                scope.data.activeGroups = [];
                                scope.data.activeGroups.push(group);
                            }

                            scope.data.activeColor = groupColor;
                        });
                    });

                    angle += angleplus;

                    //Update sets
                    var group = scope.data.groups[sect.data('label')];
                    groupSets[group].push(sect);
                    clock.push(sect);
                }

                for(var i = 0; i < values.length; i++){
                    process(i);
                }


                var updateClockFromData = function(data){
                    clock.forEach(function(sector){
                        var sectorLabel = sector.data('label');
                        var rgb = data[sectorLabel];
                        var color = $window.Raphael.rgb(rgb.r/16, rgb.g/16, rgb.b/16);

                        //We fill the sector here so that the image matches the clock exactly, regardless
                        //of group assignments
                        var group = scope.data.groups[sectorLabel];
                        //TODO: This could be problematic if the clock state returned does not match group assignments
                        scope.data.groupColors[group] = color;
                    });
                }

                //Repeatedly check for lights
                clockService.getCurrentLights(updateClockFromData);

                var getCurrentLights = function(){
                    scope.$apply(function(){
                        clockService.getCurrentLights(updateClockFromData);
                    });
                };

                //setInterval(getCurrentLights, 10000);


                /** INFO: Disabling group watching since changing groups is disabled
                scope.$watch('data.groups', function(newValues, oldValues){
                    var changed = false;
                    for(var label = 0; label < newValues.length; label++){
                        if(newValues[label] != oldValues[label]){
                            changed = true;
                            var newGroupLabel = newValues[label];
                            var oldGroupLabel = oldValues[label];
                            var newGroup = groupSets[newGroupLabel];
                            var oldGroup = groupSets[oldGroupLabel];

                            clock.forEach(function(element){
                                if(element.data('label') == label){
                                    oldGroup.exclude(element);
                                    newGroup.push(element);
                                }
                            });

                            //Change active sector to new group
                            if(scope.data.activeGroup == newGroupLabel){
                                //if the active sector doesn't change, we need to manually update the clock
                                clock.stop().animate({transform: ""}, 250);
                                newGroup.stop().animate({transform: "s1.1 1.1 " + cx + " " + cy}, 250);
                            } else {
                                scope.data.activeGroup = newGroupLabel;
                            }

                            //Update colors so all sectors in the group match
                            var groupColor = scope.data.groupColors[newGroupLabel];
                            scope.data.activeColor = groupColor;
                            newGroup.attr('fill', groupColor);
                        }
                    }
                    if(changed){
                        clockService.sendAll(scope);
                    }
                }, true);
                */


                scope.$watch('data.groupColors', function(newValues, oldValues){
                    //TODO: Update based upon groups here

                    angular.forEach(newValues, function(value, key){
                       if(oldValues[key] != value){
                           var set = groupSets[key];
                           if(set){
                            set.attr('fill', value);
                           }
                       }
                    });
                }, true);

                scope.$watch('data.activeGroups', function(activeGroups){
                    angular.forEach(groupSets, function(set, key) {
                        if(_.contains(activeGroups, key)) {
                            set.stop().animate({transform: "s1.1 1.1 " + cx + " " + cy}, 250);
                        } else {
                            set.stop().animate({transform: ""}, 250);
                        }
                    });

                }, true);


            }
        }
    });

})();