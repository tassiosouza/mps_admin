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
var mpsCoordinate = new mapkit.Coordinate(33.1522247, -117.2310085)
var map = new mapkit.Map("map", { center: mpsCoordinate})
var span = new mapkit.CoordinateSpan(.8)
var region = new mapkit.CoordinateRegion(mpsCoordinate, span)
map.setRegionAnimated(region)

// ** Plot subscriptions with clusters colors
for(var i = 0; i < subscriptions.length; i++) {
  var coordinate = new mapkit.Coordinate(subscriptions[i].latitude, subscriptions[i].longitude)
  var subsClusters = JSON.parse(subscriptions[i].clusters)
  var lastCluster = subsClusters.clusters[subsClusters.clusters.length - 1]
  var matchClusters = clusters.filter(cluster => cluster.id === lastCluster)
  var annot = new mapkit.MarkerAnnotation(coordinate, {
      color: matchClusters[0].color,
      glyphColor: '#000',
  });
  map.addAnnotation(annot)
}



