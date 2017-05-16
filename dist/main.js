'use strict';

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _Route = require('./Route.js');

var _Route2 = _interopRequireDefault(_Route);

var _Waypoint = require('./Waypoint.js');

var _Waypoint2 = _interopRequireDefault(_Waypoint);

var _RouteCollection = require('./RouteCollection.js');

var _RouteCollection2 = _interopRequireDefault(_RouteCollection);

var _strategies = require('./strategies');

var _directionsApi = require('directions-api');

var _directionsApi2 = _interopRequireDefault(_directionsApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var util = require('util');
console.log('--------------------------------------------------------');


var directions = new _directionsApi2.default('AIzaSyBw9WbNkrlLt4IXxpGzAAmQrRCn_PchFog');

var maxDistance = 900000;

var waypoints = [new _Waypoint2.default(10, 56, 10), new _Waypoint2.default(10.1, 56.4, 2), new _Waypoint2.default(10.2, 56.3, 4), new _Waypoint2.default(10.3, 56.2, 7), new _Waypoint2.default(10.4, 56.1, 9)];

function orienteering(iterations, waypoints, strategy) {
  strategy(waypoints, iterations).then(function (boxes) {
    console.log(boxes);
    // console.log(data);
    // let workingRoutes = new RouteCollection();
    // let possibleRoutes = new RouteCollection();
    //
    // for (let i = 1; i < waypoints.length; i++) {
    //   const route = new Route(waypoints[0], waypoints[i], data);
    //
    //   if (route.distance > 0 && route.distance <= maxDistance)
    //     workingRoutes.add(route);
    // }
    //
    // while (workingRoutes.length) {
    //   const workingRoute = workingRoutes.shift().clone();
    //
    //   waypoints.forEach(waypoint => {
    //     const localWorkingRoute = workingRoute.clone();
    //
    //     if (_.isEqual(waypoint, waypoints[0])) {
    //       localWorkingRoute.add(waypoint);
    //
    //       if (localWorkingRoute.distance <= maxDistance &&
    //           !possibleRoutes.contains(localWorkingRoute))
    //         possibleRoutes.add(localWorkingRoute);
    //     } else if (!localWorkingRoute.containsWaypoint(waypoint)) {
    //       localWorkingRoute.add(waypoint);
    //
    //       if (localWorkingRoute.distance <= maxDistance &&
    //           !workingRoutes.contains(localWorkingRoute))
    //         workingRoutes.add(localWorkingRoute);
    //     }
    //   });
    // }
    //
    // possibleRoutes.sort((a, b) => b.value - a.value);
    //
    // const route = possibleRoutes.get(0);
    //
    // const asmdk = route.waypoints.map(waypoint => {
    //   return `${waypoint.latitude},${waypoint.longitude}`;
    // });
    //
    // directions.query({
    //   mode: 'walking',
    //   origin: asmdk.shift(),
    //   destination: asmdk.pop(),
    //   waypoints: asmdk.join('|'),
    // }).then(result => {
    //   const totalDistance = result.routes[0].legs.reduce((a, b, index) => {
    //     if (index === 1) {
    //       return a.distance.value + b.distance.value;
    //     }
    //
    //     return a + b.distance.value;
    //   });
    //
    //   console.log(route.distance, totalDistance);
    // });
  }).catch(console.error);
}

// mangelPaaBedreNavn(1, waypoints, highestValueFirst);
// mangelPaaBedreNavn(4, waypoints, diagonalization);

orienteering(4, waypoints, _strategies.diagonalization);