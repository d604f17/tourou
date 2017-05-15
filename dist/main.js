'use strict';

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _Edge = require('./Edge.js');

var _Edge2 = _interopRequireDefault(_Edge);

var _Route = require('./Route.js');

var _Route2 = _interopRequireDefault(_Route);

var _Waypoint = require('./Waypoint.js');

var _Waypoint2 = _interopRequireDefault(_Waypoint);

var _RouteCollection = require('./RouteCollection.js');

var _RouteCollection2 = _interopRequireDefault(_RouteCollection);

var _strategies = require('./strategies');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var util = require('util');
console.log('--------------------------------------------------------');


var maxDistance = 900000;

var waypoints = [new _Waypoint2.default(10, 56, 10), new _Waypoint2.default(10.1, 56.4, 2), new _Waypoint2.default(10.2, 56.3, 4), new _Waypoint2.default(10.3, 56.2, 7), new _Waypoint2.default(10.4, 56.1, 9)];

function mangelPaaBedreNavn(iterations, waypoints, strategy) {
  strategy(waypoints, iterations).then(function (data) {
    var workingRoutes = new _RouteCollection2.default();
    var possibleRoutes = new _RouteCollection2.default();

    for (var i = 1; i < waypoints.length; i++) {
      var route = new _Route2.default(waypoints[0], waypoints[i], data);

      if (route.distance > 0 && route.distance <= maxDistance) workingRoutes.add(route);
    }

    var _loop = function _loop() {
      var workingRoute = workingRoutes.shift().clone();

      waypoints.forEach(function (waypoint) {
        var localWorkingRoute = workingRoute.clone();

        if (_underscore2.default.isEqual(waypoint, waypoints[0])) {
          localWorkingRoute.add(waypoint);
          if (localWorkingRoute.distance <= maxDistance && !possibleRoutes.contains(localWorkingRoute)) possibleRoutes.add(localWorkingRoute);
        } else if (!localWorkingRoute.containsWaypoint(waypoint)) {
          localWorkingRoute.add(waypoint);
          if (localWorkingRoute.distance <= maxDistance && !workingRoutes.contains(localWorkingRoute)) workingRoutes.add(localWorkingRoute);
        }
      });
    };

    while (workingRoutes.length) {
      _loop();
    }

    // console.log(util.inspect(possibleRoutes, false, null));
    console.log(possibleRoutes);

    // console.log(data);
  }).catch(console.error);
}

mangelPaaBedreNavn(1, waypoints, _strategies.highestValueFirst);