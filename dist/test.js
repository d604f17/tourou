'use strict';

var _Waypoint = require('./Waypoint');

var _Waypoint2 = _interopRequireDefault(_Waypoint);

var _BoundedBox = require('./BoundedBox');

var _BoundedBox2 = _interopRequireDefault(_BoundedBox);

var _Edge = require('./Edge');

var _Edge2 = _interopRequireDefault(_Edge);

var _strategies = require('./strategies');

var _orienteering = require('./orienteering');

var _orienteering2 = _interopRequireDefault(_orienteering);

var _halfnhalf = require('./halfnhalf');

var _halfnhalf2 = _interopRequireDefault(_halfnhalf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs');
var util = require('util');
console.log('--------------------------------------------------------');


var iterations = 0;
var maxDistance = 30000;
var country = process.argv.pop();
var attractions = require('./attractions/' + country);

var getArea = function getArea(box) {
  var vertical = new _Edge2.default({ longitude: box.e, latitude: box.n }, { longitude: box.e, latitude: box.s });
  var horizontal = new _Edge2.default({ longitude: box.e, latitude: box.n }, { longitude: box.w, latitude: box.n });

  return vertical.haversineDistance * horizontal.haversineDistance;
};

var start = new Date().getTime();
var waypoints = attractions.map(function (sight) {
  return new _Waypoint2.default(sight.lng, sight.lat, sight.popularity);
});
(0, _orienteering2.default)(iterations, maxDistance, waypoints, _strategies.one).then(function (route) {
  var end = new Date().getTime();

  var area = getArea(_BoundedBox2.default.generateFromWaypoints(route.waypoints));
  var text = route.hash + ', ' + 'one' + ', ' + route.value + ', ' + country + ', ' + waypoints.length + ', ' + area + ', ' + iterations + ', ' + route.distance + ', ' + route.realDistance + ', ' + maxDistance + ', ' + (end - start) + ', ' + JSON.stringify(route);
  fs.writeFile(__dirname + '/tests/' + country + '.txt', text, { flag: 'w' }, function (error) {
    console.log(error);
  });
}).catch(console.error);