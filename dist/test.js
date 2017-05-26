'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _haversine = require('haversine');

var _haversine2 = _interopRequireDefault(_haversine);

var _BoundedBox = require('./strategies/BoundedBox');

var _BoundedBox2 = _interopRequireDefault(_BoundedBox);

var _mmas = require('./aco/mmas');

var _mmas2 = _interopRequireDefault(_mmas);

var _halfnhalf = require('./aco/halfnhalf');

var _halfnhalf2 = _interopRequireDefault(_halfnhalf);

var _strategies = require('./strategies');

var _attractions = require('../attractions');

var _attractions2 = _interopRequireDefault(_attractions);

var _directions = require('./directions');

var _directions2 = _interopRequireDefault(_directions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var attractions = {};
Object.keys(_attractions2.default).map(function (city) {
  attractions[city] = _attractions2.default[city].map(function (attraction) {
    return [attraction['lng'], attraction['lat'], attraction['popularity']];
  });
});

var log = function log(name, data, callback) {
  _fs2.default.writeFileSync(__dirname + '/../logs/' + name + '.log', data);
  callback();
};

var test = function test(name, func) {
  return function () {
    console.log(name, 'started');
    return new Promise(function (resolve) {
      func(function (data) {
        resolve(data);
        log(name, data, function () {
          console.log(name, 'complete');
        });
      });
    });
  };
};

var asyncIterate = function asyncIterate(list, callback) {
  (function iterate(index) {
    callback(list[index], index, function () {
      if (index + 1 < list.length) iterate(++index);
    });
  })(0);
};

var getArea = function getArea(box) {
  var verticalA = { longitude: box.e, latitude: box.n };
  var verticalB = { longitude: box.e, latitude: box.s };
  var horizontalA = { longitude: box.e, latitude: box.n };
  var horizontalB = { longitude: box.w, latitude: box.n };
  var vertical = (0, _haversine2.default)(verticalA, verticalB, { unit: 'meter' });
  var horizontal = (0, _haversine2.default)(horizontalA, horizontalB, { unit: 'meter' });
  return vertical * horizontal;
};

var oneTest = function oneTest(city, waypoints, passes) {
  var queries = [];

  for (var i = 1; i <= passes; i++) {
    queries.push(test('ant-one_' + city + '_p' + i, function (resolve) {
      var start = new Date().getTime();
      (0, _strategies.one)(waypoints).then(function (boxes) {
        var route = (0, _mmas2.default)(waypoints, boxes);

        var coordinates = route._tour.map(function (vertex) {
          return vertex.y + ',' + vertex.x;
        });

        var area = getArea(_BoundedBox2.default.generateFromWaypoints(route._graph._vertices.map(function (v) {
          return [v.x, v.y];
        })));

        _directions2.default.query({
          mode: 'walking',
          origin: coordinates.shift(),
          destination: coordinates.pop(),
          waypoints: coordinates.join('|')
        }).then(function (result) {
          var legs = result.routes[0].legs;
          var distances = legs.map(function (leg) {
            return leg.distance.value;
          });
          route._realDistance = distances.reduce(function (a, b) {
            return a + b;
          });
          route._realDistance += 2500 * (legs.length - 2);

          var end = new Date().getTime();
          var routeData = route.value + ', ' + route._distance + ', ' + route._realDistance;
          var inputData = '' + waypoints.length;
          delete route['_graph'];
          resolve(routeData + ', ' + inputData + ', ' + area + ', ' + (end - start) + ', ' + JSON.stringify(route));
        });
      });
    }));
  }

  return queries;
};

var diagonalizationTest = function diagonalizationTest(city, waypoints, passes, iterations) {
  var queries = [];

  for (var i = 1; i <= passes; i++) {
    queries.push(test('ant-diag_' + city + '_i' + iterations + '_p' + i, function (resolve) {
      var start = new Date().getTime();

      (0, _strategies.diagonalization)(waypoints, iterations).then(function (boxes) {
        var route = (0, _mmas2.default)(waypoints, boxes);

        var coordinates = route._tour.map(function (vertex) {
          return vertex.y + ',' + vertex.x;
        });

        var area = getArea(_BoundedBox2.default.generateFromWaypoints(route._graph._vertices.map(function (v) {
          return [v.x, v.y];
        })));
        _directions2.default.query({
          mode: 'walking',
          origin: coordinates.shift(),
          destination: coordinates.pop(),
          waypoints: coordinates.join('|')
        }).then(function (result) {
          var legs = result.routes[0].legs;
          var distances = legs.map(function (leg) {
            return leg.distance.value;
          });
          route._realDistance = distances.reduce(function (a, b) {
            return a + b;
          });
          route._realDistance += 2500 * (legs.length - 2);

          var end = new Date().getTime();
          var routeData = route.value + ', ' + route._distance + ', ' + route._realDistance;
          var inputData = waypoints.length + ', ' + iterations;
          delete route['_graph'];
          resolve(routeData + ', ' + inputData + ', ' + area + ', ' + (end - start) + ', ' + JSON.stringify(route));
        });
      });
    }));
  }

  return queries;
};

var theHalfeningTest = function theHalfeningTest(city, waypoints, passes, iterations) {
  var queries = [];

  for (var i = 1; i <= passes; i++) {
    queries.push(test('ant-half_' + city + '_i' + iterations + '_p' + i, function (resolve) {
      var start = new Date().getTime();
      (0, _halfnhalf2.default)(iterations, 30000, waypoints).then(function (route) {
        var end = new Date().getTime();

        var area = getArea(_BoundedBox2.default.generateFromWaypoints(route._graph._vertices.map(function (v) {
          return [v.x, v.y];
        })));

        var routeData = route.value + ', ' + route._distance + ', ' + route._realDistance;
        var inputData = waypoints.length + ', ' + iterations;
        delete route['_graph'];
        resolve(routeData + ', ' + inputData + ', ' + area + ', ' + (end - start) + ', ' + JSON.stringify(route));
      });
    }));
  }

  return queries;
};

var tests = [].concat(_toConsumableArray(oneTest('aalborg', attractions.aalborg, 5)), _toConsumableArray(oneTest('johannesburg', attractions.johannesburg, 5)), _toConsumableArray(oneTest('madrid', attractions.madrid, 5)), _toConsumableArray(oneTest('copenhagen', attractions.copenhagen, 5)), _toConsumableArray(oneTest('lasVegas', attractions.lasVegas, 5)), _toConsumableArray(oneTest('losAngeles', attractions.losAngeles, 5)), _toConsumableArray(oneTest('cairo', attractions.cairo, 5)), _toConsumableArray(oneTest('newYorkCity', attractions.newYorkCity, 5)), _toConsumableArray(oneTest('venice', attractions.venice, 5)));

asyncIterate(tests, function (test, index, next) {
  console.log(tests.length - index + ' tests left');
  test().then(function () {
    next();
  });
});
//# sourceMappingURL=test.js.map