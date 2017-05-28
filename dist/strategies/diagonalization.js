'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _strategy = require('./strategy');

var _BoundedBox = require('../BoundedBox');

var _BoundedBox2 = _interopRequireDefault(_BoundedBox);

var _directions = require('./../directions');

var _directions2 = _interopRequireDefault(_directions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var splitBoundedBox = function splitBoundedBox(box) {
  var width = Math.abs(box.w - box.e);
  var height = Math.abs(box.n - box.s);

  if (width >= height) {
    return [new _BoundedBox2.default([box.w, box.n], [box.w + width / 2, box.s]), new _BoundedBox2.default([box.w + width / 2, box.n], [box.e, box.s])];
  } else {
    return [new _BoundedBox2.default([box.w, box.n], [box.e, box.s + height / 2]), new _BoundedBox2.default([box.w, box.s + height / 2], [box.e, box.s])];
  }
};

var asyncIterate = function asyncIterate(list, callback) {
  (function iterate(index) {

    callback({ value: list[index], done: index == list.length - 1 }, index, function () {
      if (index + 1 < list.length) iterate(++index);
    });
  })(0);
};

var diagonalization = function diagonalization(waypoints, iterations) {
  return new Promise(function (resolve) {
    var count = 0;
    var boxes = [_BoundedBox2.default.generateFromWaypoints(waypoints)];

    while (count < iterations - 1) {
      boxes.push.apply(boxes, _toConsumableArray(splitBoundedBox(boxes.shift())));
      count++;
    }

    var queries = boxes.map(function (box) {
      return { origin: box.n + ',' + box.w, destination: box.s + ',' + box.e };
    });

    _directions2.default.query(queries).then(function (directions) {
      var result = [];

      boxes.forEach(function (box, i) {
        var route = directions[i].routes[0];

        if (route) {
          var distance = route['legs'][0]['distance']['value'];
          var difference = distance / box.haversineDistance;
          box.multiplier = parseFloat(difference.toFixed(3));
        } else {
          box.multiplier = 1;
        }

        result.push(box);
      });

      resolve(result);
    });
  });
};

exports.default = diagonalization;
//# sourceMappingURL=diagonalization.js.map