'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queryBoxDistance = exports.queryEdgeDistance = undefined;

var _directions = require('../directions');

var _directions2 = _interopRequireDefault(_directions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var queryEdgeDistance = exports.queryEdgeDistance = function queryEdgeDistance(edge) {
  return new Promise(function (resolve, reject) {
    _directions2.default.query({
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
    _directions2.default.query({
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
//# sourceMappingURL=strategy.js.map