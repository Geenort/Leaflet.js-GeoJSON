// Create map object
var myMap = L.map("map", {
  center: [40.7, -73.95],
  zoom: 2
});

// Add tile layer to the map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

// API query URL
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";

// Function that determines color based on magnitude
function chooseColor(magnitude) {
  mag = parseFloat(magnitude);
  if (mag >= 5.0 ) {
    return '#922B21';
  } else if (mag >= 4.0 ) {
    return '#D35400';
  } else if (mag >= 3.0 ) {
    return '#EB984E';
  } else if (mag >= 2.0 ) {
    return '#F8C471';
  } else {
    return '#F9E79F';
  }
}

// Grab the geoJSON data with d3
d3.json(url, function(response) {

  // log geoJSON data for viewing pleasure
  console.log(response);

  // Add GeoJSON layer from response with two options
  L.geoJSON(response, {
    // determines how geoJSON points / features are added as layers to map. default layer is marker but we need circles with variable radius. pass in each feature and latlng
    pointToLayer: (feature, latlng) => {
      magnitude = feature.properties.mag;
      return L.circle(latlng, {
        radius: magnitude**2*5000,
        color: chooseColor(magnitude),
        fillColor: chooseColor(magnitude),
        fillOpacity: 0.7,
        opacity: 0.8,
        weight: 1
      });
    },
    // for each feature, bind popup with magnitude, place, and datetime
    onEachFeature: (feature, layer) => {
      layer.bindPopup("<h2>Magnitude: " + feature.properties.mag + "</h2><hr><h3>" + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }
  }).addTo(myMap);

  // Set up legend as main div
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    magnitudes = [1.0, 2.0, 3.0, 4.0, 5.0]
    var colors = ['#F9E79F','#F8C471','#EB984E','#D35400','#922B21'];
    var labels = [];

    // Add divs for text
    var legendInfo = "<h3>Earthquake Magnitude,<br>Richter Scale</h3>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">1.0</div>" +
        "<div class=\"max\">5.0+</div>" +
      "</div>";
    div.innerHTML = legendInfo;

    // Create colored inline li blocks inside ul, add to div
    magnitudes.forEach((magnitude,index) => {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });
    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Add legend to the map
  legend.addTo(myMap);
});

