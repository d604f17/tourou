'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _directionsApi = require('directions-api');

var _directionsApi2 = _interopRequireDefault(_directionsApi);

var _Waypoint = require('./../Waypoint.js');

var _Waypoint2 = _interopRequireDefault(_Waypoint);

var _Edge = require('./../Edge.js');

var _Edge2 = _interopRequireDefault(_Edge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var directions = new _directionsApi2.default('AIzaSyBw9WbNkrlLt4IXxpGzAAmQrRCn_PchFog');

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

var splitBoundedBox = function splitBoundedBox(box) {
  var width = Math.abs(box.nw[0] - box.se[0]);
  var height = Math.abs(box.nw[1] - box.se[1]);

  if (width >= height) {
    return [{ nw: [box.nw[0], box.nw[1]], se: [box.nw[0] + width / 2, box.se[1]] }, { nw: [box.nw[0] + width / 2, box.nw[1]], se: [box.se[0], box.se[1]] }];
  } else {
    return [{ nw: [box.nw[0], box.nw[1]], se: [box.se[0], box.se[1] + height / 2] }, { nw: [box.nw[0], box.se[1] + height / 2], se: [box.se[0], box.se[1]] }];
  }
};

var boxToEdge = function boxToEdge(box) {
  return new _Edge2.default({ latitude: box.nw[1], longitude: box.nw[0] }, { latitude: box.se[1], longitude: box.se[0] });
};

var queryDistance = function queryDistance(edge, box) {
  return new Promise(function (resolve, reject) {
    directions.query({
      mode: 'walking',
      origin: edge.a.latitude + ',' + edge.a.longitude,
      destination: edge.b.latitude + ',' + edge.b.longitude
    }).then(function (result) {
      edge.walkingDistance = result.routes[0].legs[0].distance.value;
      edge.box = box;
      resolve(edge);
    }).catch(reject);
  });
};

var andreasFindPaaEtNavn = function andreasFindPaaEtNavn(waypoints, iterations) {
  return new Promise(function (resolve) {
    var count = 0;
    var queries = [];
    var boxes = [calculateBoundedBox(waypoints)];

    while (count < iterations - 1) {
      var box = splitBoundedBox(boxes.shift());
      boxes.push.apply(boxes, _toConsumableArray(box));
      count++;
    }

    boxes.forEach(function (box) {
      queries.push(queryDistance(boxToEdge(box), box));
    });

    Promise.all(queries).then(function (edges) {
      resolve(edges.map(function (edge) {
        return _extends({}, edge.box, {
          multiplier: edge.walkingDistance / edge.haversineDistance
        });
      }));
    });

    // resolve(boxes);
  });
};

exports.default = andreasFindPaaEtNavn;