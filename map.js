<script type="text/javascript">

  $(function() {

    var 
    user  = "nejohnson2",
    table = "life_of_trash";
    lat   = 40.719599,
    lng   = -74.000902,
    zoom  = 13;

    // Define the initial options
    var cartodbMapOptions = {
      zoom: zoom,
      center: new google.maps.LatLng( lat, lng ),
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    // Initialize the map
    var map = new google.maps.Map(document.getElementById("map"),cartodbMapOptions);

    // Define the map styles
    var map_style = [{
      stylers: [{ saturation: -65 }, { gamma: 1.52 }] }, {
      featureType: "administrative", stylers: [{ saturation: -95 }, { gamma: 2.26 }] }, {
      featureType: "water", elementType: "labels", stylers: [{ visibility: "off" }] }, {
      featureType: "administrative.locality", stylers: [{ visibility: 'off' }] }, {
      featureType: "road", stylers: [{ visibility: "simplified" }, { saturation: -99 }, { gamma: 2.22 }] }, {
      featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }, {
      featureType: "road.arterial", stylers: [{ visibility: 'off' }] }, {
      featureType: "road.local", elementType: "labels", stylers: [{ visibility: 'off' }] }, {
      featureType: "transit", stylers: [{ visibility: 'off' }] }, {
      featureType: "road", elementType: "labels", stylers: [{ visibility: 'off' }] }, {
      featureType: "poi", stylers: [{ saturation: -55 }]
    }];

    // Set the style
    map.setOptions({ styles: map_style });

    // Define the layer
    var cartoDBLayer = {
      getTileUrl: function(coord, zoom) {
        return "https://" + user + ".cartodb.com/tiles/" + table + "/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
      },
      tileSize: new google.maps.Size(256, 256)
    };

    // Add the CartoDB tiles
    map.overlayMapTypes.insertAt(0, new google.maps.ImageMapType(cartoDBLayer));

  });

</script>

<div id="map"></div>