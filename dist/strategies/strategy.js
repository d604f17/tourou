'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queryBoxDistance = exports.queryEdgeDistance = undefined;

var _directionsApi = require('directions-api');

var _directionsApi2 = _interopRequireDefault(_directionsApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var directions = new _directionsApi2.default('AIzaSyBw9WbNkrlLt4IXxpGzAAmQrRCn_PchFog');

var queryEdgeDistance = exports.queryEdgeDistance = function queryEdgeDistance(edge) {
  return new Promise(function (resolve, reject) {
    directions.query({
      mode: 'walking',
      origin: edge.a.latitude + ',' + edge.a.longitude,
      destination: edge.b.latitude + ',' + edge.b.longitude
    }).then(function (result) {
      resolve({
        distance: result.routes[0].legs[0].distance.value,
        edge: edge
      });
    });
  });
};

var queryBoxDistance = exports.queryBoxDistance = function queryBoxDistance(box) {
  return new Promise(function (resolve) {
    directions.query({
      mode: 'walking',
      origin: box.n + ',' + box.w,
      destination: box.s + ',' + box.e
    }).then(function (result) {
      var distance = 0;
      var route = result.routes[0];

      if (route) {
        var leg = route.legs[0];
        distance = leg.distance.value;
        // box.nw = [leg.start_location.lng, leg.start_location.lat];
        // box.se = [leg.end_location.lng, leg.end_location.lat];
      }

      resolve({ distance: distance, box: box });
    });
  });
};