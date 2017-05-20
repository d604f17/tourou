'use strict';

var _Waypoint = require('./Waypoint.js');

var _Waypoint2 = _interopRequireDefault(_Waypoint);

var _strategies = require('./strategies');

var _orienteering = require('./orienteering');

var _orienteering2 = _interopRequireDefault(_orienteering);

var _halfnhalf = require('./halfnhalf');

var _halfnhalf2 = _interopRequireDefault(_halfnhalf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var util = require('util');
console.log('--------------------------------------------------------');


var attractions = require('./attractions/denmark-funen-odense.json');

var maxDistance = 10000;

console.time('runtime');
var waypoints = attractions.map(function (sight) {
  return new _Waypoint2.default(sight.lng, sight.lat, sight.popularity);
});
console.log(waypoints.length);
(0, _orienteering2.default)(0, maxDistance, waypoints, _strategies.diagonalization).then(function (route) {
  // console.log(route);
  console.log(util.inspect(route, false, null));
  console.timeEnd('runtime');
}).catch(console.error);