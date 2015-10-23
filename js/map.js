(function (window) {

  window.initMap = function() {
    var myLatLng = {lat: 34.8697395, lng: -111.76098960000002};

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 7,
      center: myLatLng
    });

    var marker = new google.maps.Marker({
      position: myLatLng,
      map: map,
      icon: 'img/map-marker.svg'
    });
  }

})(window);
