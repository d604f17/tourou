'use strict';

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _Waypoint = require('./Waypoint.js');

var _Waypoint2 = _interopRequireDefault(_Waypoint);

var _Route = require('./Route.js');

var _Route2 = _interopRequireDefault(_Route);

var _Edge = require('./Edge.js');

var _Edge2 = _interopRequireDefault(_Edge);

var _RouteCollection = require('./RouteCollection.js');

var _RouteCollection2 = _interopRequireDefault(_RouteCollection);

var _strategies = require('./strategies');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var util = require('util');

console.log('--------------------------------------------------------');


var maxDistance = 30000;

var waypoints = [new _Waypoint2.default(56, 10, 10), new _Waypoint2.default(56.1, 10, 2), new _Waypoint2.default(56, 10.1, 4), new _Waypoint2.default(56, 10.5, 7), new _Waypoint2.default(56.1, 10.1, 9)];

var workingRoutes = new _RouteCollection2.default();
var possibleRoutes = new _RouteCollection2.default();

for (var i = 0; i < waypoints.length; i++) {
  var route = new _Route2.default(waypoints[0], waypoints[i]);

  if (route.distance > 0 && route.distance <= maxDistance) workingRoutes.add(route);
}

//console.log(util.inspect(workingRoutes, false, null));

var workingRoute = workingRoutes.shift();
// console.log(workingRoute);
// console.log('llllllllllllllllllllllllllllllllllllllllll');
for (var _i = 0; _i < waypoints.length - 2; _i++) {
  var localWorkingRoute = workingRoute.clone();
  var waypoint = waypoints[_i];

  if (_underscore2.default.isEqual(waypoint, waypoints[0])) {
    console.log('if');
    //   //console.log('overview', waypoint, workingRoute);
    localWorkingRoute.add(waypoint);
    //   //console.log('working route', workingRoute);
    //   //console.log('possibleRoutes', util.inspect(possibleRoutes, false, null));
    //   //possibleRoutes.add(localWorkingRoute);
    //   //console.log('possibleRoutes', util.inspect(possibleRoutes, false, null));
    //   //console.log('::::::::::::::::::::::::::::::::::::::::::::::::::::::');
  } else if (!localWorkingRoute.containsWaypoint(waypoint)) {
    console.log('else');
    localWorkingRoute.add(waypoint);
    //   //workingRoutes.add(localWorkingRoute);
  }
  //
  console.log(_i);
  console.log('working', workingRoute);
  console.log('local', localWorkingRoute);
}

// Route {
//   edges: [ Edge { a: [Object], b: [Object], haversineDistance: 11119 } ],
//       value: 12,
//       distance: 11119,
//       waypoints:
//   [ Waypoint { id: 1, latitude: 56, longitude: 10, value: 10 },
//     Waypoint { id: 2, latitude: 56.1, longitude: 10, value: 2 } ] }

// highestValueFirst(waypoints, 2).then(data => {
//   //console.log(data);
//
//   waypoints.forEach(waypoint => {
//     const route = new Route(waypoints[0], waypoint);
//     if (route.distance > 0 && route.distance <= maxDistance) workingRoutes.add(route);
//   });
//
//   while (workingRoutes.length) {
//     console.log(workingRoutes.length);
//     const workingRoute = workingRoutes.shift();
//     console.log(workingRoutes.length);
//     waypoints.forEach(waypoint => {
//       if (waypoint === waypoints[0]) {
//         workingRoute.add(waypoint);
//         console.log('possible', workingRoute);
//         if (workingRoute.distance <= maxDistance)
//           possibleRoutes.add(workingRoute);
//       } else if (!workingRoute.containsWaypoint(waypoint)) {
//         workingRoute.add(waypoint);
//         // console.log('working', workingRoute);
//         if (workingRoute.distance <= maxDistance)
//           workingRoutes.add(workingRoute);
//       }
//     });
//   }
// });