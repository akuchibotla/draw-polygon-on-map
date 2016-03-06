var markers = [];
var line;

function initAutocomplete() {
	var map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat: 37.871927, lng: -122.2607267},
	  zoom: 13,
	  mapTypeId: google.maps.MapTypeId.ROADMAP
	});

	var input = document.getElementById('pac-input');
	var searchBox = new google.maps.places.SearchBox(input);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

	map.addListener('bounds_changed', function() {
	  searchBox.setBounds(map.getBounds());
	});

	searchBox.addListener('places_changed', function() {
	  var places = searchBox.getPlaces();

	  if (places.length == 0) {
	    return;
	  }

	  var bounds = new google.maps.LatLngBounds();
	  places.forEach(function(place) {
	    var icon = {
	      url: place.icon,
	      size: new google.maps.Size(71, 71),
	      origin: new google.maps.Point(0, 0),
	      anchor: new google.maps.Point(17, 34),
	      scaledSize: new google.maps.Size(25, 25)
	    };

	    if (place.geometry.viewport) {
	      // Only geocodes have viewport.
	      bounds.union(place.geometry.viewport);
	    } else {
	      bounds.extend(place.geometry.location);
	    }
	  });
	  map.fitBounds(bounds);
	});

	map.addListener('click', function(e) {
	    placeMarker(e.latLng, map);
	    drawPolyline(map);
	});
}

function placeMarker(latLng, map) {
  var marker = new google.maps.Marker({
	position: latLng,
	draggable: true,
	map: map
  });

  markers.push(marker);

  marker.addListener('rightclick', function() {
  	marker.setMap(null);
  	drawPolyline(map);
  })

  marker.addListener('dragend', function() {
  	drawPolyline(map);
  });
}

function drawPolyline(map) {

	if (line != null) {
		line.setMap(null);
	}

	coords = markersToCoords();

	coords.push(markers[0].getPosition());

	line = new google.maps.Polyline({
	    path: coords,
	    geodesic: true,
	    strokeColor: '#FF0000',
	    strokeOpacity: 1.0,
	    strokeWeight: 2
	});

	line.setMap(map);
}

function markersToCoords() {
	var coords = [];
	for(var i = 0; i < markers.length; i++) {
		if (markers[i].map) {
			coords.push(markers[i].getPosition());
		}
	}
	return coords;
}

document.getElementsByTagName('button')[0].addEventListener("click", function() {
	var displayCoords = window.open("", "MsgWindow", "width=200, height=100");
	var coords = markersToCoords();
	for(var i = 0; i < coords.length; i++) {
		displayCoords.document.write("{lat:" + coords[i].lat().toString() + ", lng:" + + coords[i].lng().toString() + "}");
	}
});
