'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BoundedBox = require('../BoundedBox');

var _BoundedBox2 = _interopRequireDefault(_BoundedBox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var one = function one(waypoints) {
  return new Promise(function (resolve) {
    var box = _BoundedBox2.default.generateFromWaypoints(waypoints);
    box.multiplier = 1;
    resolve([box]);
  });
};

exports.default = one;
//# sourceMappingURL=one.js.map