'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../strategies/index');

var _mmas = require('./mmas');

var _mmas2 = _interopRequireDefault(_mmas);

var _directions = require('../directions');

var _directions2 = _interopRequireDefault(_directions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var util = require('util');

var halfnhalf = function halfnhalf(iterations, maxDistance, waypoints) {
  return new Promise(function (resolve) {
    var count = 0;
    var bestRoute = void 0;
    var bestRouteDistance = Number.MIN_SAFE_INTEGER;

    (function loop(min, max) {
      if (count < iterations) {
        ++count;

        (0, _index.one)(waypoints).then(function (boxes) {
          var route = (0, _mmas2.default)(waypoints, boxes, { maxDistance: max });

          var coordinates = route._tour.map(function (vertex) {
            return vertex.y + ',' + vertex.x;
          });

          _directions2.default.query({
            mode: 'walking',
            origin: coordinates.shift(),
            destination: coordinates.pop(),
            waypoints: coordinates.join('|')
          }).then(function (result) {
            var legs = result.routes[0].legs;
            var distances = legs.map(function (leg) {
              return leg.distance.value;
            });
            route._realDistance = distances.reduce(function (a, b) {
              return a + b;
            });
            route._realDistance += 2500 * (legs.length - 1);

            if (typeof bestRoute === 'undefined') {
              bestRoute = route;
              bestRouteDistance = route._realDistance;
            }

            var localMin = min,
                localMax = max;

            if (Math.round(min) === Math.round(max)) {
              count = iterations;
              bestRoute = route;
              bestRouteDistance = route._realDistance;
            } else if (route._realDistance > maxDistance) {
              localMax = min + (max - min) / 2;
            } else if (route._realDistance < maxDistance) {
              if (route._realDistance > bestRouteDistance || bestRouteDistance > maxDistance) {
                bestRoute = route;
                bestRouteDistance = route._realDistance;
              }
              localMin = max;
              localMax = max + (max - min) / 2;
            } else {
              count = iterations;
              bestRoute = route;
              bestRouteDistance = route._realDistance;
            }
            loop(localMin, localMax);
          });
        }).catch(console.error);
      } else {
        resolve(bestRoute);
      }
    })(0, maxDistance);
  });
};

exports.default = halfnhalf;
//# sourceMappingURL=halfnhalf.js.map