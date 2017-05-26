'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _strategies = require('./strategies');

var _orienteering = require('./orienteering');

var _orienteering2 = _interopRequireDefault(_orienteering);

var _directions = require('directions');

var _directions2 = _interopRequireDefault(_directions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var util = require('util');

var halfnhalf = function halfnhalf(iterations, maxDistance, waypoints) {
  return new Promise(function (resolve) {
    var count = 0;
    var bestRoute = void 0;
    var bestRouteDistance = Number.MIN_VALUE;

    (function loop(min, max) {
      if (count < iterations) {
        ++count;
        (0, _orienteering2.default)(0, max, waypoints, _strategies.one).then(function (route) {
          var localMin = min,
              localMax = max;

          if (Math.round(min) === Math.round(max)) {
            count = iterations;
            bestRoute = route;
            bestRouteDistance = route.realDistance;
          } else if (route.realDistance > maxDistance) {
            localMax = min + (max - min) / 2;
          } else if (route.realDistance < maxDistance) {
            if (route.realDistance > bestRouteDistance) {
              bestRoute = route;
              bestRouteDistance = route.realDistance;
            }
            localMin = max;
            localMax = max + (max - min) / 2;
          } else {
            count = iterations;
            bestRoute = route;
            bestRouteDistance = route.realDistance;
          }
          loop(localMin, localMax);
        });
      } else {
        resolve(bestRoute);
      }
    })(0, maxDistance);
  });
};

exports.default = halfnhalf;
//# sourceMappingURL=halfnhalf.js.map