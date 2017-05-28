'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _strategy = require('./strategy');

var _BoundedBox = require('./BoundedBox');

var _BoundedBox2 = _interopRequireDefault(_BoundedBox);

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
    var queries = void 0;
    var count = 0;
    var boxes = [_BoundedBox2.default.generateFromWaypoints(waypoints)];

    while (count < iterations - 1) {
      boxes.push.apply(boxes, _toConsumableArray(splitBoundedBox(boxes.shift())));
      count++;
    }

    queries = boxes.map(function (box) {
      return function () {
        return (0, _strategy.queryBoxDistance)(box);
      };
    });

    var nodes = [];
    asyncIterate(queries, function (data, index, next) {
      data.value().then(function (node) {
        nodes.push(node);

        next();

        if (data.done) {
          resolve(nodes.map(function (node) {
            var difference = void 0;
            var box = node.box;


            if (node.distance > 0) {
              difference = node.distance / box.haversineDistance;
              box.multiplier = parseFloat(difference.toFixed(3));
            } else {
              box.multiplier = 1;
            }

            return box;
          }));
        }
      });
    });

    // Promise.all(queries).then(data => {
    //   resolve(data.map(node => {
    //     let difference;
    //     let {box} = node;
    //
    //     if (node.distance > 0) {
    //       difference = node.distance / box.haversineDistance;
    //       box.multiplier = parseFloat(difference.toFixed(3));
    //     } else {
    //       box.multiplier = 1;
    //     }
    //
    //     return box;
    //   }));
    // });
  });
};

exports.default = diagonalization;
//# sourceMappingURL=diagonalization.js.map