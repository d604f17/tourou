'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _mmas = require('./mmas/mmas');

var _mmas2 = _interopRequireDefault(_mmas);

var _strategies = require('./strategies');

var _attractions = require('../attractions');

var _attractions2 = _interopRequireDefault(_attractions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var attractions = {};

Object.keys(_attractions2.default).map(function (city) {
  attractions[city] = _attractions2.default[city].map(function (attraction) {
    return [attraction['lng'], attraction['lat'], attraction['popularity']];
  });
});

var log = function log(name, data, callback) {
  _fs2.default.writeFile(__dirname + '/../logs/' + name + '.log', data, function (error) {
    if (error) console.error(error);
    callback();
  });
};

function asyncIterate(list, callback) {
  (function iterate(index) {
    callback(list[index], index, function () {
      if (index + 1 < list.length) iterate(++index);
    });
  })(0);
}

var antTest = function antTest(graphSize, iterations, colonySize) {
  return function () {
    return new Promise(function (resolve, reject) {
      var waypoints = attractions.sydney.slice(0, graphSize);
      (0, _strategies.one)(waypoints).then(function (boxes) {
        var route = (0, _mmas2.default)(waypoints, boxes, {
          maxIterations: iterations,
          colonySize: colonySize
        });

        var data = graphSize + ', ' + iterations + ', ' + colonySize + ', ' + route._value + ', ' + route._distance + '\r\n';

        _fs2.default.appendFile(__dirname + '/../logs/ant.tests.csv', data, function (error) {
          if (error) reject(error);else resolve(route);
        });
      });
    });
  };
};

var tests = [];
for (var graphSize = 10; graphSize <= 50; graphSize += 10) {
  for (var iterations = 10; iterations <= 100; iterations += 10) {
    for (var colonySize = 5; colonySize <= 30; colonySize += 5) {
      for (var i = 1; i <= 5; i++) {
        tests.push(antTest(graphSize, iterations, colonySize));
      }
    }
  }
}

var timeout = null;
asyncIterate(tests, function (test, index, next) {
  if (timeout == null) {
    console.log(tests.length - index + ' left');
    timeout = setTimeout(function () {
      timeout = null;
    }, 10000);
  }

  test().then(function () {
    next();
  });
});
//# sourceMappingURL=ant-tests.js.map