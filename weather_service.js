(function(){
	console.log("Weather service say's hi!");
	var weather = require('weather');
	var url = require('url');
	var request = require('request');
	var _ = require('underscore');
	
	var upperLeds = [0, 1, 2, 9, 10, 11];
	var lowerLeds = [3, 4, 5, 6, 7, 8];
	var ledTimes = [3000, 3000, 3000, 3000, 3000, 3000];
	
	var urlObj = {
		protocol: 'http:',
		host : "192.168.1.101:8080",
		pathname : "/light_leds"
	};

	/**
	 * Converts an HSL color value to RGB. Conversion formula
	 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
	 * Assumes h, s, and l are contained in the set [0, 1] and
	 * returns r, g, and b in the set [0, 2000].
	 *
	 * @param   Number  h       The hue
	 * @param   Number  s       The saturation
	 * @param   Number  l       The lightness
	 * @return  Array           The RGB representation
	 */
	function hslToRgb(h, s, l){
		var r, g, b;

		if(s == 0){
			r = g = b = l; // achromatic
		}else{
			function hue2rgb(p, q, t){
				if(t < 0) t += 1;
				if(t > 1) t -= 1;
				if(t < 1/6) return p + (q - p) * 6 * t;
				if(t < 1/2) return q;
				if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
				return p;
			}

			var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			var p = 2 * l - q;
			r = hue2rgb(p, q, h + 1/3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1/3);
		}
		
		return {
			r : Math.floor(r * 2000),
			g : Math.floor(g * 2000),
			b : Math.floor(b * 2000)
		};

	}
	
	function Constrain(value, low, high){
		if(value > high) return high;
		if(value < low) return low;
		return value;
	}
	
	//Handles new weather data from Yahoo
	function WeatherUpdateHandler(data) {
		console.log(data);	
		
		var highTemp = Constrain(data.high, 0, 35);
		console.log("high temp: " + highTemp + "C " + (highTemp/5*9+32) + "F");
		var lowTemp = Constrain(data.low, 0, 35);
		console.log("low temp: " + lowTemp + "C " + (lowTemp/5*9+32) + "F");
		
		var highHue = Constrain((.75 -.0215*highTemp), 0, 1);
		console.log('high hue: ' + highHue);
		
		var lowHue = Constrain((.75 -.0215*lowTemp), 0 ,1);
		console.log('low hue: ' + lowHue);
		
		var saturation = 0.9;
		var lightness = 0.3;
		
		var rgbHigh = hslToRgb(highHue, saturation, lightness);
		console.log("rgb high: " + rgbHigh);
		
		var rgbLow = hslToRgb(lowHue, saturation, lightness);
		console.log("rgb low: " + rgbLow);
		
		var lowReds = [], lowGreens = [], lowBlues = [];
		var highReds = [], highGreens = [], highBlues = [];
		//load high and low rgb values
		for(var i = 0; i < 6; i++){
			highReds.push(rgbHigh.r);
			highGreens.push(rgbHigh.g);
			highBlues.push(rgbHigh.b);	
			lowReds.push(rgbLow.r);
			lowGreens.push(rgbLow.g);
			lowBlues.push(rgbLow.b);
		}
		
		var highUrlObj = _.clone(urlObj);
		highUrlObj.query = {
			light_number : upperLeds.join(),
			r : highReds.join(),
			g : highGreens.join(),
			b : highBlues.join(),
			time : ledTimes.join()
		};
		
		var lowUrlObj = _.clone(urlObj);
		lowUrlObj.query = {
			light_number : lowerLeds.join(),
			r : lowReds.join(),
			g : lowGreens.join(),
			b : lowBlues.join(),
			time : ledTimes.join()
		};
		
		var highUrl = url.format(highUrlObj);
		request(highUrl, function(error, response, body){	
		});
		
		var lowUrl = url.format(lowUrlObj);
		request(lowUrl, function(error, response, body){	
		});
	}

	function GetWeather(){
		var options = {
			location : 'Norwalk',
			logging : true,
			appid : "_svqXQXV34EgOh1RD1FUqKejttRBzHce3S.uEa1JdZkUeI14X6ihQPG0FuFFgA--"
		};

		weather(options, WeatherUpdateHandler);
	};
	
	var cronJob = require('cron').CronJob;
	var weatherJob = new cronJob('00 00 08 * * *', GetWeather,
	function(){
		console.log("Weather job scheduled every morning at 8AM");
	},
	false, //run now
	"America/New_York");
	

})();
