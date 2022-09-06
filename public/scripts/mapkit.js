// ** Initialize Apple MapKit With Fixed Token
mapkit.init({
  authorizationCallback: function(done) {
      done("eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjYzV0s1OFRXQzYifQ.eyJpc3MiOiJDRUJWNjRRNVA5IiwiaWF0IjoxNjYwNzk3MTc0LCJleHAiOjE2OTIzMTY4MDB9.NKXcDBSo-RqfLoza4ZYhIAMoD1t8L_iR17ZM5eeQY2qQW6uOIUh57PohDSaTiwmTosz52te32E02ZzPVZ0T_Rg");
  }
});

// ** Init variables
var route = null
var orders = []
var points = []
var driverLocation = []
var coordinates = []
var intervalId = null

// ** Create and Set Map Initial View
var coordinate = new mapkit.Coordinate(33.1522247, -117.2310085)
var map = new mapkit.Map("map", { center: coordinate});
var span = new mapkit.CoordinateSpan(.8);
var region = new mapkit.CoordinateRegion(coordinate, span);
map.setRegionAnimated(region)

// ** Retrieve Route and Orders Info
var nodes=[], values=[];
for (var att, i = 0, atts = document.getElementById("map").attributes, n = atts.length; i < n; i++){
  att = atts[i];
  nodes.push(att.nodeName);
  values.push(att.nodeValue);
}

route = JSON.parse(values[1])
orders = JSON.parse(values[2])

orders.sort((a, b) => (a.sort > b.sort) ? 1 : -1)
points = JSON.parse(route.points)

for(var i = 0; i < points.length; i++) {
  points.map(cord => {
      coordinates.push(new mapkit.Coordinate(cord[1], cord[0]))
  })
}

// var pol = new mapkit.PolylineOverlay(coordinates,
// {
//   style: new mapkit.Style({
//       lineWidth: 2,
//       strokeColor: "#3AB81A"
//   })
// });

// map.addOverlay(pol)
if(route != null) {
  intervalId = window.setInterval(function(){
    console.log('refreshing')
  
    fetch('https://27e6dnolwrdabfwawi2u5pfe4y.appsync-api.us-west-1.amazonaws.com/graphql', {
    method: 'POST',
    headers: {
      'X-API-KEY': 'da2-xbr7j7wwh5hk5ej6t477nglsra',
      'Accept': 'application/json',
      'Content-Type': 'application/json'
  },
    body: JSON.stringify({
      query: `
        query MyQuery ($id: ID!) {
            getDriver(id: $id) {
              latitude
              longitude
              name
            }
          }
        `,
      variables: {
        id: route.driverID,
      }
    }),
  })
  .then((res) => res.json())
    .then((result) => {
      console.log(JSON.stringify(result))
      
      // ** Remove driver location annotation
      if(map.annotations.length > orders.length) {
        map.removeAnnotation(map.annotations[map.annotations.length - 1])
      }
  
      // ** Add updated driver location annotation
      if(result.data.getDriver.latitude != null) {
        var coordinate = new mapkit.Coordinate(result.data.getDriver.latitude, result.data.getDriver.longitude)
        var annot = new mapkit.MarkerAnnotation(coordinate, {
            title: result.data.getDriver.name,
            subtitle: 'Driver',
            color: "#FFFFFF",
            glyphColor: "#2F2E41",
            glyphText: '0'
        });
        map.addAnnotation(annot)
      }
    })
  }, 5000)
} else {
  console.log('clear')
  intervalId = null
  var intervals = [];
  $(".elements").each(function() {
      var i = setInterval(function() {

      }, 1000);
      intervals.push(i);
  });
  intervals.forEach(clearInterval);
}



for(var i = 0; i < orders.length; i++) {
  var coordinate = new mapkit.Coordinate(orders[i].latitude, orders[i].longitude)
  var annot = new mapkit.MarkerAnnotation(coordinate, {
      title: orders[i].number,
      subtitle: orders[i].customerName,
      color: "#3AB81A",
      glyphColor: "#2F2E41",
      glyphText: orders[i].sort + "°"
  });
  
  map.addAnnotation(annot)
}