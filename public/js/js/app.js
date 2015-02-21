var app = angular.module('clockApp', ['ui.bootstrap']);

app.controller('ClockCtrl', function($scope, $timeout, clockService){
    $scope.data = {
        isDragging: false,
        time : 1000,
        duration : 5000,
        activeSector : '', //A - L
        activeColor : '#000000', //initial color
        activeRgb : {r : 0, g : 0, b : 0},
        selectableGroups : ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
        groupColors : {
            A : '#000000',
            B : '#000000',
            C : '#000000',
            D : '#000000',
            E : '#000000',
            F : '#000000',
            G : '#000000',
            H : '#000000',
            I : '#000000',
            J : '#000000',
            K : '#000000',
            L : '#000000'
        },
        groups : ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
        presets : [],
        name : 'untitled',
        id : undefined,
        playAnimation : false,
        index : 0,
        states : []
    };

    $scope.accordion = {
        colorPicker : true,
        groups : false,
        options : false,
        apps : false,
        saves : false
    };

    $scope.PlayAnimation = function(){
        $scope.data.playAnimation = true;
        ApplyPreset(0, $scope.data.states);
    };

    var stop;
    $scope.StopAnimation = function(){
        $scope.data.playAnimation = false;
        $timeout.cancel(stop);
    };

    $scope.GroupAll = function(){
        for(var i = 0; i < 12; i++){
            $scope.data.groups[i] = 'A';
        }
    };

    $scope.ResetGroups = function(){
        for(var i = 0; i < 12; i++){
            $scope.data.groups[i] = $scope.data.selectableGroups[i];
        }
    };

    $scope.SetPresetGroup = function(preset){
        if(preset === 1)
            $scope.data.groups = ['A', 'A', 'A', 'B', 'B', 'B', 'B', 'B', 'B', 'A', 'A', 'A'];
        if(preset === 2)
            $scope.data.groups = ['A', 'A', 'A', 'A', 'A', 'A', 'B', 'B', 'B', 'B', 'B', 'B'];
        if(preset === 3)
            $scope.data.groups = ['A', 'A', 'A', 'A', 'B', 'B', 'B', 'B', 'C', 'C', 'C', 'C'];
        if(preset === 4)
            $scope.data.groups = ['A', 'A', 'B', 'B', 'B', 'B', 'C', 'C', 'C', 'C', 'A', 'A'];
        if(preset === 5)
            $scope.data.groups = ['A', 'A', 'A', 'B', 'B', 'B', 'C', 'C', 'C', 'D', 'D', 'D'];
        if(preset === 6)
            $scope.data.groups = ['A', 'B', 'A', 'B', 'A', 'B', 'A', 'B', 'A', 'B', 'A', 'B'];
        if(preset === 7)
            $scope.data.groups = ['A', 'B', 'B', 'A', 'A', 'B', 'B', 'A', 'A', 'B', 'B', 'A'];
        if(preset === 8)
            $scope.data.groups = ['A', 'A', 'B', 'B', 'A', 'A', 'B', 'B', 'A', 'A', 'B', 'B'];
        if(preset === 9)
            $scope.data.groups = ['A', 'B', 'C', 'A', 'B', 'C', 'A', 'B', 'C', 'A', 'B', 'C'];
        if(preset === 10)
            $scope.data.groups = ['A', 'B', 'C', 'D', 'A', 'B', 'C', 'D', 'A', 'B', 'C', 'D'];

        $scope.data.activeSector = 'A';
    };

    $scope.TurnOff = function(){
        for(var i = 0; i < 12; i++){
            var group = $scope.data.selectableGroups[i];
            $scope.data.groupColors[group] = "#000000";
        }
        $scope.data.activeSector = "";
        $scope.data.activeColor = "#000000";
        $scope.data.activeRgb = {r: 0, g: 0, b: 0};
        clockService.shutdown($scope);

    }

    function ApplyPreset(index, states){
        var state = states[index];
        var groupsChanged = false;
        for(var i = 0; i < 12; i++){
            if(state.groups[i] != $scope.data.groups[i]){
                groupsChanged = true;
            }
        }
        $scope.data.groupColors = state.groupColors;
        $scope.data.groups = state.groups;
        $scope.data.time = state.transition;
        $scope.data.duration = state.duration;
        $scope.data.index = index;

        //if there is no change in groups, we need to manually send the update to the clock
        //since that is normally what would trigger the clock to update
        if(!groupsChanged){
            clockService.sendAll($scope);
        }

        if($scope.data.playAnimation){
            var time = state.transition + state.duration;
            stop = $timeout(function(){
                var nextIndex = ((index + 1) % states.length);
                ApplyPreset(nextIndex, states);
            }, time);
        }
    }

    $scope.ApplyPreset = function(name, id){
        clockService.getPreset(id, function(states){
            $scope.data.states = states;
            $scope.data.name = name;
            $scope.data.id = id;
            ApplyPreset(0, states);
        });
    };

    $scope.UpdateCurrentState = function(){
        var stateObj = {
            duration : $scope.data.duration,
            transition : $scope.data.time,
            groups : $scope.data.groups,
            groupColors : $scope.data.groupColors
        }

        var index = $scope.data.index;
        if(index < $scope.data.states.length){
            $scope.data.states[index] = stateObj;
        } else {
            $scope.data.states.push(stateObj);
        }
    }

    $scope.ApplyPreviousState = function(){
        $scope.StopAnimation();
        $scope.UpdateCurrentState();
        var index = ($scope.data.index - 1) % $scope.data.states.length;
        ApplyPreset(index, $scope.data.states);
    };

    $scope.ApplyNextState = function(){
        $scope.StopAnimation();
        $scope.UpdateCurrentState(); //first save changes to the current state before moving to next state
        var index = ($scope.data.index + 1) % $scope.data.states.length;
        ApplyPreset(index, $scope.data.states);
    };

    function NameExists(name){
        for(var i = 0; i < $scope.data.presets.length; i++){
            if(name === $scope.data.presets[i].name){
                return true;
            }
        }
        return false;
    }

    function RemoveName(name){
        var index = null;
        for(var i = 0; i < $scope.data.presets.length; i++){
            if(name === $scope.data.presets[i].name){
                index = i;
                break;
            }
        }
        if(index >= 0){
            $scope.data.presets.splice(index, 1);
        }
    }

    function SaveSuccess(data){
        $scope.data.presets.push(data);
        alert('"' + $scope.data.name + '"' + " was successfully saved.");
    }

    $scope.Save = function(){
        var name = $scope.data.name;
        if(name && name != "untitled"){
            if(NameExists(name)){
                var r = confirm('"' + name + '"' + " already exists, would you like to overwrite it?");
                if(r){
                    RemoveName(name);
                    clockService.save($scope, SaveSuccess);
                }
            } else {
                clockService.save($scope, SaveSuccess);
            }
        } else {
            alert("Please enter a valid name before saving.");
        }

    };

    function DeleteSuccess(data){
        RemoveName($scope.data.name);
        alert('"' + $scope.data.name + '"' + " was successfully deleted.");
    }

    $scope.Delete = function(){
        var name = $scope.data.name;
        if(NameExists(name)){
            var r = confirm("Are you sure you want to delete " + '"' + name + '"');
            if(r){
                clockService.delete($scope, DeleteSuccess);
            }
        }
    };

    //Fetch Presets
    clockService.getPresets(function(data){
        $scope.data.presets = data;
    });

    //Save the initial state
    $scope.UpdateCurrentState();

});