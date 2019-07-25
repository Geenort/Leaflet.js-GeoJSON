// Creating map object
var myMap = L.map("map", {
  center: [40.7, -73.95],
  zoom: 2
});

// Adding tile layer to the map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

//API query URL
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Grab the data with d3
d3.json(url, function(response) {
  console.log(response);
  data = response.features;
  var bubbles = L.bubbleLayer();
  // Loop through data
  for (var i = 0; i < data.length; i++) {

    // Set the data location property to a variable
    var longlat = data[i].geometry.coordinates;
    var magnitude = data[i].properties.mag;
    if (longlat) {
      bubbles.addLayer(L.marker([longlat[1], longlat[0]]), 
        {property: magnitude}
      );
        //.bindPopup(response[i].descriptor));
    }

  }

  // Add our marker cluster layer to the map
  myMap.addLayer(bubbles);

});
