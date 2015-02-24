//Anonymous function (to not pollute the global namespace)
(function(){
    var CronJob = require('cron').CronJob;
    var Express = require('express');
    var _ = require('underscore');
    var Sqlite3 = require('sqlite3').verbose();
   
    //Initialize DB 
    var db = new Sqlite3.Database(__dirname + '/db/clock.db');

    //Initialize Serial Port
    var serialport = require('serialport');
    var SerialPort = serialport.SerialPort;
    var serialPort = new SerialPort("/dev/ttyUSB0", {
        baudrate: 9600,
        parser: serialport.parsers.readline("\n")
    }, false);

    //Initialize stored led values
    var cached_light_data = [];
    var total_lights = 12;
    for(var i = 0; i < total_lights; i++){
        var light_object = {r: 0, g: 0, b: 0};
        cached_light_data.push(light_object);
    }

    //Initialize latest interacted with time
    var lastSet = Date.now();

    // * * * * *  command to execute
    // │ │ │ │ │
    // │ │ │ │ │
    // │ │ │ │ └───── day of week (0 - 6) (0 to 6 are Sunday to Saturday, or use names; 7 is Sunday, the same as 0)
    // │ │ │ └────────── month (1 - 12)
    // │ │ └─────────────── day of month (1 - 31)
    // │ └──────────────────── hour (0 - 23)
    // └───────────────────────── min (0 - 59)
 
    //Initialize periodic task
    var job = new CronJob('0,15,30,45 * * * *', function() {
        var now = Date.now();
        if( (now - lastSet) > 60 * 60 * 1000 ) {
            var serialStrings = "";
            cached_light_data = [];
            for(var i = 0; i < total_lights; i++){
                var light_object = {r: 0, g: 0, b: 0};
                cached_light_data.push(light_object);
                serialStrings += i + " 0 0 0 1000" + '\n';
            }
            
            serialPort.write(serialStrings, function(err, results) {
                if(err) console.log('err: ' + err);
            });

            lastSet = now;
        }
    }, true, "America/New_York");


    //Setup serial communication (open serial port & setup reading callback handler)
    serialPort.open(function() {
        console.log('Serial Port Open.');

        //Serial data recieve handler
        serialPort.on('data', function(data) {
            console.log('Data received: ' + data);

            //Parse data and put into cached_light_data
            var parsed_data = data.split(" ");
            var parsed_light_number = parseInt(parsed_data[0]);
            var parsed_red_value = parseInt(parsed_data[1]);
            var parsed_green_value = parseInt(parsed_data[2]);
            var parsed_blue_value = parseInt(parsed_data[3]);

            if (parsed_light_number >= 0 && parsed_light_number < cached_light_data.length) {
                cached_light_data[parsed_light_number].r = parsed_red_value;
                cached_light_data[parsed_light_number].g = parsed_green_value;
                cached_light_data[parsed_light_number].b = parsed_blue_value;
            }

        });
    });

    var app = Express();

    //update lastSet for each request
    app.use(function (req, res, next) {
        lastSet = Date.now();
        next();
    });

    //Serve files in /public
    app.use(Express.static(__dirname + '/public'));

    //Parses post body
    app.use(Express.bodyParser());

    //Post to /presets adds a new preset
    app.post('/api/presets', function(req, res){
        db.serialize(function(){
            db.run("PRAGMA foreign_keys = ON;");
            db.run("DELETE FROM Presets WHERE name = ?;", req.body.name);
            //db.run("DELETE FROM States WHERE preset_name =  ?;", req.body.name);
            db.run("INSERT INTO Presets VALUES(NULL, ?, date('now'), ?);", req.body.name, req.body.size);
            _.each(req.body.states, function(state){
                var obj = {
                    $name : req.body.name,
                    $duration : state.duration,
                    $transition :state.transition,
                    $groupA : state.groupColors.A,
                    $groupB : state.groupColors.B,
                    $groupC : state.groupColors.C,
                    $groupD : state.groupColors.D,
                    $groupE : state.groupColors.E,
                    $groupF : state.groupColors.F,
                    $groupG : state.groupColors.G,
                    $groupH : state.groupColors.H,
                    $groupI : state.groupColors.I,
                    $groupJ : state.groupColors.J,
                    $groupK : state.groupColors.K,
                    $groupL : state.groupColors.L,
                    $sector0 : state.groups[0],
                    $sector1 : state.groups[1],
                    $sector2 : state.groups[2],
                    $sector3 : state.groups[3],
                    $sector4 : state.groups[4],
                    $sector5 : state.groups[5],
                    $sector6 : state.groups[6],
                    $sector7 : state.groups[7],
                    $sector8 : state.groups[8],
                    $sector9 : state.groups[9],
                    $sector10 : state.groups[10],
                    $sector11 : state.groups[11]
                };

                db.run(
                    "INSERT INTO States VALUES(NULL, $name, $duration, $transition, " +
                    "$groupA, $groupB, $groupC, $groupD, " +
                    "$groupE, $groupF, $groupG, $groupH, " +
                    "$groupI, $groupJ, $groupK, $groupL, " +
                    "$sector0, $sector1, $sector2, $sector3, " +
                    "$sector4, $sector5, $sector6, $sector7, " +
                    "$sector8, $sector9, $sector10, $sector11);", obj
                );
            });

            db.get("SELECT * from Presets WHERE name = ?;", req.body.name, function(err, row){
                if(err){
                    res.send("err: " + err);
                } else {
                    res.send(JSON.stringify(row));
                }
            });

        });

    });

    var selectableGroups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

    //Retrieves the preset with the given ID
    app.get('/api/presets/:id', function(req, res){
        db.serialize(function(){
            var stmt = db.prepare("SELECT * FROM Presets INNER JOIN States ON Presets.name = States.preset_name WHERE Presets.id = ?;", req.params.id);
            stmt.all(function(err, rows){
                if(err){
                    res.send("err: " + err);
                } else {
                    var sendData = [];
                    for(var index = 0; index < rows.length; index++){
                        var data = {};
                        var state = rows[index];
                        var groups = [];
                        var groupColors = {};
                        for(var i = 0; i < 12; i++){
                            var key = 'sector' + i; //sector0-11
                            var group = selectableGroups[i];
                            var colorKey = 'group' + group; //groupA-L
                            groupColors[group] = state[colorKey];
                            groups.push(state[key]);
                        }
                        data.groups = groups;
                        data.groupColors = groupColors;
                        data.transition = state.transition;
                        data.duration = state.duration;
                        sendData.push(data);
                    }
                    res.send(JSON.stringify(sendData));
                }
            });
        });
    });

    app.del('/api/presets/:id', function(req, res){
        db.serialize(function(){
            db.run("PRAGMA foreign_keys = ON;");
            db.run("DELETE FROM Presets WHERE id = ?;", req.params.id, function(err){
               if(err){
                   res.send("err: " + err);
               } else {
                   res.send(req.params.id + " deleted successfully.");
               }
            });
        });
    });

    //Retrieves the list of presets
    app.get('/api/presets', function(req, res){
        db.serialize(function() {
            var stmt = db.prepare("SELECT * from Presets;");
            stmt.all(function(err, rows){
                if(err){
                    res.send("err: " + err);
                } else {
                    res.send(JSON.stringify(rows));
                }
            });
        });

    });

    /* Sets multiple lights at once
     *  /light_leds?light_number=ALL&r=1000&g=0&b=0&time=5000 set all lights to red over 5 seconds
     *  /light_leds?light_number=1,2,3&r=1000,1000,1000&g=0,0,0&b=g=0,0,0&time=1000,1000,1000 set 3 lights to red over 1 seconds
     */
    app.get('/api/light_leds', function(req, res){
        var light_numbers = [];
        var red_values = [];
        var green_values = [];
        var blue_values = [];
        var time_values = [];

        if(req.query.light_number.toUpperCase() === "ALL"){
            for(var i = 0; i < 12; i++){
                light_numbers.push(i);
                red_values.push(req.query.r);
                green_values.push(req.query.g);
                blue_values.push(req.query.b);
                time_values.push(req.query.time);
            }
        } else {
            light_numbers = req.query.light_number.split(',');
            red_values = req.query.r.split(',');
            green_values = req.query.g.split(',');
            blue_values = req.query.b.split(',');
            time_values = req.query.time.split(',');
        }

        //construct serial string
        var serialStrings = "";
        for(var i = 0; i < light_numbers.length; i++){
            serialStrings += light_numbers[i] + " ";
            serialStrings += (i < red_values.length) ? red_values[i] : 0;
            serialStrings += " ";
            serialStrings += (i < green_values.length) ? green_values[i] : 0;
            serialStrings += " ";
            serialStrings += (i < blue_values.length) ? blue_values[i] : 0;
            serialStrings += " ";
            serialStrings += (i < time_values.length) ? time_values[i] : 0;
            serialStrings += '\n';
        }

        console.log("Data Sent:\n" + serialStrings);

        //Send string to arduino using serial communication
        serialPort.write(serialStrings, function(err, results) {
            if(err) console.log('err: ' + err);
        });

        //Send HTTP response back to client
        res.send(serialStrings);
    });

    /*
     *	/light_led?light_number=0&r=1000&g=0&b=0&time=5000 set 1 led to red over 5 seconds
     */
    app.get('/api/light_led', function(req, res){
        //Create the string to send over serial to the Arduino (space delimited with newline ending)

        var light_number = parseInt(req.query.light_number);
        light_number = (isNaN(light_number)) ? 0 : light_number;

        var red_value = parseInt(req.query.r);
        red_value = (isNaN(red_value)) ? 0 : red_value;

        var green_value = parseInt(req.query.g);
        green_value = (isNaN(green_value)) ? 0 : green_value;

        var blue_value = parseInt(req.query.b);
        blue_value = (isNaN(blue_value)) ? 0 : blue_value;

        var time_value = parseInt(req.query.time);
        time_value = (isNaN(time_value)) ? 0 : time_value;

        var serialString = light_number + " " + red_value + " " + green_value + " " + blue_value + " " + time_value + "\n";
        console.log("Data Sent:\n" + serialString);

        //Send string to arduino using serial communication
        serialPort.write(serialString, function(err, results) {
            if(err) console.log('err: ' + err);
        });

        //Send HTTP response back to client
        res.send(serialString);
    });

    app.get('/api/current_lights', function(req, res){
        res.send(cached_light_data);
    });

    //Start server
    var port = 8080;
    app.listen(port);
    console.log("Listening on port " + port);

})();
