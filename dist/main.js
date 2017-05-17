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


// const directions = new Directions('AIzaSyBw9WbNkrlLt4IXxpGzAAmQrRCn_PchFog');
var directions = new _directionsApi2.default('AIzaSyDoHGpEGGn6nwiyWXvhOvOSOoTLnWwE4TE');

var maxDistance = 7000;

var waypoints = [new _Waypoint2.default(12.563432, 55.675073, 0), // hotel sas cph
new _Waypoint2.default(12.608115, 55.676042, 300), // christiania
new _Waypoint2.default(12.568147, 55.673684, 500), // tivoli gardens
new _Waypoint2.default(12.57573, 55.681347, 200), // rundetårn
new _Waypoint2.default(12.574741, 55.674648, 100)];

function orienteering(iterations, waypoints, strategy) {
  strategy(waypoints, iterations).then(function (boxes) {
    var workingRoutes = new _RouteCollection2.default();
    var possibleRoutes = new _RouteCollection2.default();

    for (var i = 1; i < waypoints.length; i++) {
      var _route = new _Route2.default(waypoints[0], waypoints[i], boxes);

      if (_route.distance > 0 && _route.distance <= maxDistance) workingRoutes.add(_route);
    }

    var _loop = function _loop() {
      var workingRoute = workingRoutes.shift();

      waypoints.forEach(function (waypoint) {
        var localWorkingRoute = workingRoute.clone();

        // check for index istedet for object match
        if (_underscore2.default.isEqual(waypoint, waypoints[0])) {
          localWorkingRoute.add(waypoint);

          if (localWorkingRoute.distance <= maxDistance) possibleRoutes.replaceIfBetter(localWorkingRoute);
        } else if (!localWorkingRoute.containsWaypoint(waypoint)) {
          localWorkingRoute.add(waypoint);

          if (localWorkingRoute.distance <= maxDistance) workingRoutes.replaceIfBetter(localWorkingRoute);
        }
      });
    };

    while (workingRoutes.length > 0) {
      _loop();
    }

    possibleRoutes.sort(function (a, b) {
      return b.value - a.value;
    });

    var route = possibleRoutes.first;

    var coordinates = route.waypoints.map(function (waypoint) {
      return waypoint.latitude + ',' + waypoint.longitude;
    });

    // console.log(route.waypoints);

    directions.query({
      mode: 'walking',
      origin: coordinates.shift(),
      destination: coordinates.pop(),
      waypoints: coordinates.join('|')
    }).then(function (result) {

      // result.routes[0].legs.forEach(leg => {
      //   delete leg.steps;
      //   // console.log(leg);
      //
      // });

      if (!result.routes.length) console.log(result);
      var totalDistance = result.routes[0].legs.reduce(function (a, b, index) {
        if (index === 1) {
          return a.distance.value + b.distance.value;
        }

        return a + b.distance.value;
      });

      console.log(route.distance, totalDistance);

      // console.log(result.routes[0].waypoint_order);

      // console.log(util.inspect(result.routes, false, null));
    });
  }).catch(console.error);
}

orienteering(1, waypoints, _strategies.diagonalization);