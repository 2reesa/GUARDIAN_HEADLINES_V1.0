var xhrRequest = function (url, type, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    callback(this.responseText);
  };
  xhr.open(type, url);
  xhr.send();
};

function locationSuccess(pos) {
  
  // Construct URL
  /*var url = "http://api.openweathermap.org/data/2.5/weather?lat=" + 
      pos.coords.latitude + "&lon=" + pos.coords.longitude;*/

  // Guardian API Headline URL
  var url = "http://content.guardianapis.com/news?api-key=test";
  
  // Send request to OpenWeatherMap
  xhrRequest(url, 'GET',
            function(responseText) {
              // responseText contains a JSON object with headline data
              var json = JSON.parse(responseText);
              
              // Headlines
              console.log("The total number of headlines passed to the app is " + json.response.results.length);
              var total_headlines = json.response.results.length; // total number of headlines in the JSON object
              var headlines = [total_headlines];
              for (var i = 0; i < total_headlines; i++) {
                console.log("Headline number " + i + " is " + json.response.results[i].webTitle);
                headlines[i] = json.response.results[i].webTitle;
              }
              
              // Assemble dictionary using our key
              var dictionary = {
                "KEY_HEADLINES": headlines.toString()
              };
              
              // Send to Pebble
              Pebble.sendAppMessage(dictionary,
                function(e) {
                  console.log("Headine info sent to Pebble successfully!");
                  console.log("Contents of KEY_HEADLINES: " + headlines.toString());
                  console.log("Length of KEY_HEADLINES: " + headlines.toString().length);
                  console.log("Type of KEY_HEADLINES: " + typeof headlines.toString());
                },
                function(e) {
                  console.log("Error sending weather info to Pebble!");
                }
              );
            });

}

function locationError(err) {
  console.log("Error requesting location!");
}

function getWeather() {
  navigator.geolocation.getCurrentPosition(
    locationSuccess,
    locationError,
    {timeout: 15000, maximumAge: 60000}
  );
}
// Listen for when the watchface is opened
Pebble.addEventListener('ready', 
  function(e) {
    console.log("PebbleKit JS ready!");
    
    // Get the initial weather
    getWeather();
  }
);

// Listen for when an AppMessage is received
Pebble.addEventListener('appmessage',
  function(e) {
    console.log("AppMessage received!");
    getWeather();
  }                     
);