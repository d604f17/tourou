'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queryBoxDistance = undefined;

var _directions = require('../directions');

var _directions2 = _interopRequireDefault(_directions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
      }

      resolve({ distance: distance, box: box });
    });
  });
};
//# sourceMappingURL=strategy.js.map