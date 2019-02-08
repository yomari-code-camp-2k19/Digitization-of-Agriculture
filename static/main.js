// Initialize and add the map
  function initMap() {
    // The location of nepal
    var nepal = {lat: 27.700769, lng: 85.300140};
    // The map, centered at nepal
    var map = new google.maps.Map(
        document.getElementById('map'), {zoom: 10, center: nepal});
    // The marker, positioned at nepal
    var marker = new google.maps.Marker({position: nepal, map: map});

    map.addListener('click',function(event){

  	  console.log(event.latLng.toLocaleString());
  	  marker.setPosition(event.latLng);
      getSoilData(event.latLng);
      
      //get elevation information from google map elevation service
      // var requestElevation = {
      //     'locations': [event.latLng]
      //   };
      // var elevationService = new google.maps.ElevationService();
      // elevationService.getElevationForLocations(requestElevation, function(results, status) {
      //     if (status == google.maps.ElevationStatus.OK) {
      //       if (results[0]) {
      //         console.log(parseFloat(results[0].elevation.toFixed(1)) + " mètres");
      //         //document.getElementById('denivele_circuit').value = parseFloat(results[0].elevation.toFixed(1)) + " mètres";
      //       }
      //     }else{
      //       console.log(status);
      //     }
      // });

  });

}

function getSoilData(latlng){
  let properties;
  let data;
  fetch('https://rest.soilgrids.org/query?lon='+latlng.lng()+'&lat='+latlng.lat())
  .then( function(res) {
    res.json().then( function(res){
      properties=res.properties;

      data={
        'ph':properties.PHIHOX.M.sl4/10,
        'rainfall':properties.PREMRG.M[getShortMonth(new Date())],
        'temp':properties.TMDMOD_2011.M[getShortMonth(new Date())],
        'alt':0,
      }

      document.getElementById('ph').value=data.ph;
      document.getElementById('rainfall').value=data.rainfall;
      document.getElementById('temp').value=data.temp;

      //get elevation second approach
      var input = {
          "lat": "27.701295887600462",
          "lon": "85.34339866699224"
      };
      
      Algorithmia.client("sim+5pAw6GmKbmM5Y1OqZ3Rq68u1")
          .algo("Gaploid/Elevation/0.3.6")
          .pipe(input)
          .then(function(output) {
              // console.log(output);
              //data.alt=output.alt;
          });
      
      getPredictions("http://localhost:8080/predict",data);
      // getPredictions("/predict",data);
    });  
  });

}



function getPredictions(url,data){
    return fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
            // "Content-Type": "application/x-www-form-urlencoded",
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(response => response.json())// parses response to JSON
    .then(res=>{
       Plotly.newPlot('suggestions-bar',res);
       
       //piechart
       var piedata = [{
         values: res[0].y,
         labels: res[0].x,
         type: 'pie'
       }]
       var layout = {
         height: 400,
         width: 500
       };

       Plotly.newPlot('suggestions-pie',piedata,layout);
       // console.log(JSON.stringify(res));
    });
}

let shortMonths =['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];  
function getShortMonth(dt){
  return shortMonths[dt.getMonth()];
}
