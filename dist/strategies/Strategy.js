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
        edge: edge,
        distance: result.routes[0].legs[0].distance.value
      });
    }).catch(reject);
  });
};

var queryBoxDistance = exports.queryBoxDistance = function queryBoxDistance(box) {
  return new Promise(function (resolve, reject) {
    directions.query({
      mode: 'walking',
      origin: box.n + ',' + box.w,
      destination: box.s + ',' + box.e
    }).then(function (result) {
      console.log(result);
      var distance = result.routes.length > 0 ? result.routes[0].legs[0].distance.value : null;
      resolve({ box: box, distance: distance });
    });
  });
};