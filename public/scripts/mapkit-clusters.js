// ** Initialize Apple MapKit With Fixed Token
mapkit.init({
  authorizationCallback: function(done) {
      done("eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjYzV0s1OFRXQzYifQ.eyJpc3MiOiJDRUJWNjRRNVA5IiwiaWF0IjoxNjYwNzk3MTc0LCJleHAiOjE2OTIzMTY4MDB9.NKXcDBSo-RqfLoza4ZYhIAMoD1t8L_iR17ZM5eeQY2qQW6uOIUh57PohDSaTiwmTosz52te32E02ZzPVZ0T_Rg");
  }
})

//** Initialize variables
var colorMap = new Map()
var subscriptions = []
var clusters = []

// ** Retreive clusters and subscriptions
var nodes=[], values=[]
for (var att, i = 0, atts = document.getElementById("map").attributes, n = atts.length; i < n; i++){
  att = atts[i]
  nodes.push(att.nodeName)
  values.push(att.nodeValue)
}
clusters = JSON.parse(values[1])
subscriptions = JSON.parse(values[2])

// ** Create and Set Map Initial View
var mpsCoordinate = new mapkit.Coordinate(33.152428, -117.227969)
var map = new mapkit.Map("map", { center: mpsCoordinate})
var span = new mapkit.CoordinateSpan(2.1)
var region = new mapkit.CoordinateRegion(mpsCoordinate, span)
map.setRegionAnimated(region)

// ** Plot subscriptions with clusters colors
for(var i = 0; i < subscriptions.length; i++) {
  var coordinate = new mapkit.Coordinate(subscriptions[i].latitude, subscriptions[i].longitude)
  var matchClusters = clusters.filter(cluster => cluster.id === subscriptions[i].clusterId)
  if(matchClusters.length) {
    var annotation = new mapkit.MarkerAnnotation(coordinate, {
      title: subscriptions[i].number,
      color: matchClusters[0].color,
      glyphColor: '#000',
      titleVisibility: mapkit.FeatureVisibility.Hidden
    });
    annotation.addEventListener("select", (event) => {
      event.target._listeners.select[0].thisObject.titleVisibility = mapkit.FeatureVisibility.Visible
    }, annotation)
    map.addAnnotation(annotation)
  }
}

//** Add space keyboard event for toggle titles visibility */
document.addEventListener('keydown', (event) => {
  var code = event.code;
  var titleVisibility = (map.annotations[0].titleVisibility == mapkit.FeatureVisibility.Hidden) ? mapkit.FeatureVisibility.Visible :
  mapkit.FeatureVisibility.Hidden

  if(code === 'Space') {
    map.annotations.map(annot => annot.titleVisibility = titleVisibility)
  }
}, false)



