'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _Route = require('./Route.js');

var _Route2 = _interopRequireDefault(_Route);

var _RouteCollection = require('./RouteCollection.js');

var _RouteCollection2 = _interopRequireDefault(_RouteCollection);

var _directionsApi = require('directions-api');

var _directionsApi2 = _interopRequireDefault(_directionsApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const directions = new Directions('AIzaSyBw9WbNkrlLt4IXxpGzAAmQrRCn_PchFog');
var directions = new _directionsApi2.default('AIzaSyDoHGpEGGn6nwiyWXvhOvOSOoTLnWwE4TE');

var orienteering = function orienteering(iterations, maxDistance, waypoints, strategy) {
  return new Promise(function (resolve) {
    strategy(waypoints, iterations).then(function (boxes) {
      var workingRoutes = new _RouteCollection2.default();
      var possibleRoutes = new _RouteCollection2.default();

      for (var i = 1; i < waypoints.length; i++) {
        var _route = new _Route2.default(waypoints[0], waypoints[i], boxes);

        if (_route.distance > 0 && _route.distance <= maxDistance) workingRoutes.push(_route);
      }

      var _loop = function _loop() {
        var workingRoute = workingRoutes.shift();

        waypoints.forEach(function (waypoint) {
          var localWorkingRoute = workingRoute.clone();

          // check for index istedet for object match
          if (_underscore2.default.isEqual(waypoint, waypoints[0])) {
            localWorkingRoute.add(waypoint);

            if (localWorkingRoute.distance <= maxDistance) possibleRoutes.pushOrReplaceIfLowerDistance(localWorkingRoute);
          } else if (!localWorkingRoute.containsWaypoint(waypoint)) {
            localWorkingRoute.add(waypoint);

            if (localWorkingRoute.distance <= maxDistance) workingRoutes.pushOrReplaceIfLowerDistance(localWorkingRoute);
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

      directions.query({
        mode: 'walking',
        origin: coordinates.shift(),
        destination: coordinates.pop(),
        waypoints: coordinates.join('|')
      }).then(function (result) {
        route.realDistance = result.routes[0].legs.reduce(function (a, b, index) {
          if (index === 1) {
            return a.distance.value + b.distance.value;
          }

          return a + b.distance.value;
        });

        resolve(route);
      });
    });
  });
};

exports.default = orienteering;