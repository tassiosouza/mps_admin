// ** Initialize Apple MapKit With Fixed Token
mapkit.init({
  authorizationCallback: function(done) {
      done("eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjYzV0s1OFRXQzYifQ.eyJpc3MiOiJDRUJWNjRRNVA5IiwiaWF0IjoxNjYwNzk3MTc0LCJleHAiOjE2OTIzMTY4MDB9.NKXcDBSo-RqfLoza4ZYhIAMoD1t8L_iR17ZM5eeQY2qQW6uOIUh57PohDSaTiwmTosz52te32E02ZzPVZ0T_Rg");
  }
});

// ** Init variables
var routes = null
var orders = []
var points = []
var driverLocation = []
var coordinates = []
var intervalId = null
var colorMap = new Map();

// ** Create and Set Map Initial View
var mpsCoordinate = new mapkit.Coordinate(33.1522247, -117.2310085)
var map = new mapkit.Map("map", { center: mpsCoordinate});
var span = new mapkit.CoordinateSpan(.8);
var region = new mapkit.CoordinateRegion(mpsCoordinate, span);
map.setRegionAnimated(region)

// ** Retrieve Route and Orders Info
var nodes=[], values=[];
for (var att, i = 0, atts = document.getElementById("map").attributes, n = atts.length; i < n; i++){
  att = atts[i];
  nodes.push(att.nodeName);
  values.push(att.nodeValue);
}

routes = JSON.parse(values[1])
routes.map(route => colorMap.set(route.id, "#" + ((1<<24)*Math.random() | 0).toString(16)))
orders = JSON.parse(values[2])


orders.sort((a, b) => (a.sort > b.sort) ? 1 : -1)

for(var i = 0; i < routes.length; i++) {
  points = JSON.parse(routes[i].points)
  var coordinates = []
  points.map(cord => {
    coordinates.push(new mapkit.Coordinate(cord[1], cord[0]))
  })
  
  var pol = new mapkit.PolylineOverlay(coordinates,
    { 
      style: new mapkit.Style({
        lineWidth:5,
        strokeOpacity:0.8,
        strokeColor: colorMap.get(routes[i].id)
      })
    });
  map.addOverlay(pol)
}


if(routes[0] != null && routes[0].driverID != '') {
  intervalId = window.setInterval(function(){
  
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
        id: routes[0].driverID,
      }
    }),
  })
  .then((res) => res.json())
    .then((result) => {
      // ** Remove driver location annotation (+1 means the MPS location added in the end)
      if(map.annotations.length > orders.length + 1) {
        map.removeAnnotation(map.annotations[map.annotations.length - 1])
      }
  
      // ** Add updated driver location annotation
      if(result.data.getDriver.latitude != null) {
        var coordinate = new mapkit.Coordinate(result.data.getDriver.latitude, result.data.getDriver.longitude)
      
        var annot = new mapkit.MarkerAnnotation(coordinate, {
          title: result.data.getDriver.name,
          subtitle: routes[0].id + " - " + "Driver",
          color: colorMap.get(routes[0].id),
          glyphColor: "#413940",
          glyphImage: {1:"/images/driver.png"}
      });
        map.addAnnotation(annot)
      }
    })
  }, 5000)
}

document.addEventListener('keydown', (event) => {
  var code = event.code;
  var titleVisibility = (map.annotations[0].titleVisibility == mapkit.FeatureVisibility.Hidden) ? mapkit.FeatureVisibility.Visible :
  mapkit.FeatureVisibility.Hidden

  if(code === 'Space') {
    map.annotations.map(annot => annot.titleVisibility = titleVisibility)
  }
}, false);

for(var i = 0; i < orders.length; i++) {
  var coordinate = new mapkit.Coordinate(orders[i].latitude, orders[i].longitude)
  var annot = new mapkit.MarkerAnnotation(coordinate, {
      title: orders[i].number,
      subtitle: orders[i].customerName,
      color: colorMap.get(orders[i].assignedRouteID),
      glyphColor: "#413940",
      glyphText: orders[i].sort + "°"
  });
  
  map.addAnnotation(annot)
}

//** MPS Location Marker */
var annot = new mapkit.MarkerAnnotation(mpsCoordinate, {
  title: "Mealp Prep Sunday",
  subtitle: "Route Origin",
  color: "#3AB81A",
  glyphColor: "#413940",
  glyphText: "MPS"
});

map.addAnnotation(annot)