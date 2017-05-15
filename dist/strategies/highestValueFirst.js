'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _directionsApi = require('directions-api');

var _directionsApi2 = _interopRequireDefault(_directionsApi);

var _edge = require('./../edge.js');

var _edge2 = _interopRequireDefault(_edge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var directions = new _directionsApi2.default('AIzaSyBw9WbNkrlLt4IXxpGzAAmQrRCn_PchFog');

var orderByHighestValue = function orderByHighestValue(waypoints) {
  var clone = [].concat(_toConsumableArray(waypoints));
  clone.sort(function (a, b) {
    return b.value - a.value;
  });
  return clone;
};

var calculateBoundedBox = function calculateBoundedBox(waypoints) {
  var minLat = void 0,
      minLon = void 0,
      maxLat = void 0,
      maxLon = void 0;
  minLat = minLon = Number.MAX_VALUE;
  maxLat = maxLon = Number.MIN_VALUE;

  waypoints.forEach(function (waypoint) {
    if (waypoint.latitude < minLat) minLat = waypoint.latitude;
    if (waypoint.latitude > maxLat) maxLat = waypoint.latitude;
    if (waypoint.longitude < minLon) minLon = waypoint.longitude;
    if (waypoint.longitude > maxLon) maxLon = waypoint.longitude;
  });

  return {
    nw: [minLon, minLat],
    se: [maxLon, maxLat]
  };
};

var queryDistance = function queryDistance(edge) {
  return new Promise(function (resolve, reject) {
    directions.query({
      mode: 'walking',
      origin: edge.a.latitude + ',' + edge.a.longitude,
      destination: edge.b.latitude + ',' + edge.b.longitude
    }).then(function (result) {
      edge.walkingDistance = result.routes[0].legs[0].distance.value;
      resolve(edge);
    }).catch(reject);
  });
};

var calculateDistance = function calculateDistance(a, b) {
  var result = a.walkingDistance / a.haversineDistance;
  if (b) result += b.walkingDistance / b.haversineDistance;
  return result;
};

var highestValueFirst = function highestValueFirst(waypoints, iteration) {
  return new Promise(function (resolve) {
    var highestValueWaypoints = orderByHighestValue(waypoints);

    var queries = [];

    for (var i = 0; i < iteration; i++) {
      var edge = new _edge2.default(highestValueWaypoints[i], highestValueWaypoints[i + 1]);
      queries.push(queryDistance(edge));
    }

    Promise.all(queries).then(function (edges) {
      var sum = edges.length > 1 ? edges.reduce(calculateDistance) : calculateDistance(edges[0]);
      var average = sum / edges.length;

      resolve([_extends({}, calculateBoundedBox(waypoints), {
        multiplier: average
      })]);
    });
  });
};

exports.default = highestValueFirst;