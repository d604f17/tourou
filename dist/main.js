'use strict';

var _Waypoint = require('./Waypoint.js');

var _Waypoint2 = _interopRequireDefault(_Waypoint);

var _strategies = require('./strategies');

var _attractionsApi = require('attractions-api');

var _attractionsApi2 = _interopRequireDefault(_attractionsApi);

var _orienteering = require('./orienteering');

var _orienteering2 = _interopRequireDefault(_orienteering);

var _halfnhalf = require('./halfnhalf');

var _halfnhalf2 = _interopRequireDefault(_halfnhalf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var util = require('util');
console.log('--------------------------------------------------------');


var attractions = new _attractionsApi2.default({
  flickr: '85f11febb88e3a4d49342a95b7bcf1e8',
  geocode: 'AIzaSyDfZBp51fjQZwk4QogCZIUtRaz8z96G0Ks'
}, 10);

var maxDistance = 7000;
//
// const waypoints = [
//   new Waypoint(12.563432, 55.675073, 0), // hotel sas cph
//   new Waypoint(12.608115, 55.676042, 300), // christiania
//   new Waypoint(12.568147, 55.673684, 500), // tivoli gardens
//   new Waypoint(12.57573, 55.681347, 200), // rundetårn
//   new Waypoint(12.574741, 55.674648, 100), // national museet
// ];

attractions.query('denmark/copenhagen').then(function (sights) {
  var waypoints = sights.map(function (sight) {
    return new _Waypoint2.default(sight.lng, sight.lat, sight.popularity);
  });

  // return orienteering(2, maxDistance, waypoints, diagonalization);
  return (0, _halfnhalf2.default)(5, maxDistance, waypoints);
}).then(function (route) {
  // console.log(route);
  console.log(util.inspect(route, false, null));
}).catch(console.error);