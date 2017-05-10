'use strict';

var _Waypoint = require('./Waypoint.js');

var _Waypoint2 = _interopRequireDefault(_Waypoint);

var _Route = require('./Route.js');

var _Route2 = _interopRequireDefault(_Route);

var _Edge = require('./Edge.js');

var _Edge2 = _interopRequireDefault(_Edge);

var _Cache = require('./Cache.js');

var _Cache2 = _interopRequireDefault(_Cache);

var _RouteCollection = require('./RouteCollection.js');

var _RouteCollection2 = _interopRequireDefault(_RouteCollection);

var _strategies = require('./strategies');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log('--------------------------------------------------------');


var maxDistance = 30000;

var waypoints = [new _Waypoint2.default(56, 10, 10), new _Waypoint2.default(56.1, 10, 2), new _Waypoint2.default(56, 10.1, 4), new _Waypoint2.default(56, 10.5, 7), new _Waypoint2.default(56.1, 10.1, 9)];

var workingRoutes = new _RouteCollection2.default();
var possibleRoutes = new _RouteCollection2.default();

(0, _strategies.highestValueFirst)(waypoints, 2).then(function (data) {
  //console.log(data);

  waypoints.forEach(function (waypoint) {
    var route = new _Route2.default(waypoints[0], waypoint);
    if (route.distance > 0 && route.distance <= maxDistance) workingRoutes.add(route);
  });

  var _loop = function _loop() {
    var workingRoute = workingRoutes.shift();
    waypoints.forEach(function (waypoint) {
      if (waypoint === waypoints[0]) {
        workingRoute.add(waypoint);
        console.log('possible', workingRoute);
        if (workingRoute.distance <= maxDistance) possibleRoutes.add(workingRoute);
      } else if (!workingRoute.containsWaypoint(waypoint)) {
        workingRoute.add(waypoint);
        // console.log('working', workingRoute);
        if (workingRoute.distance <= maxDistance) workingRoutes.add(workingRoute);
      }
    });

    // console.log(workingRoute.distance, maxDistance);
    // waypoints.forEach(waypoint => {
    //
    //   if (workingRoute.distance <= maxDistance) {
    //     if (waypoint === waypoints[0]) {
    //       workingRoute.add(waypoint);
    //       possibleRoutes.add(workingRoute);
    //     } else if (!workingRoute.containsWaypoint(waypoint)) {
    //       workingRoute.add(waypoint);
    //       workingRoutes.add(workingRoute);
    //     }
    //   }
    // });
  };

  while (workingRoutes.length) {
    _loop();
  }

  // console.log(possibleRoutes);
});