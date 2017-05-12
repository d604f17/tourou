'use strict';

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _Edge = require('./Edge.js');

var _Edge2 = _interopRequireDefault(_Edge);

var _Route = require('./Route.js');

var _Route2 = _interopRequireDefault(_Route);

var _Waypoint = require('./Waypoint.js');

var _Waypoint2 = _interopRequireDefault(_Waypoint);

var _RouteCollection = require('./RouteCollection.js');

var _RouteCollection2 = _interopRequireDefault(_RouteCollection);

var _strategies = require('./strategies');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var util = require('util');
console.log('--------------------------------------------------------');


var maxDistance = 99999999999;

var waypoints = [new _Waypoint2.default(56, 10, 10), new _Waypoint2.default(56.1, 10, 2), new _Waypoint2.default(56, 10.1, 4), new _Waypoint2.default(56, 10.5, 7), new _Waypoint2.default(56.1, 10.1, 9)];

var route = new _Route2.default(waypoints[0], waypoints[3]);

route.edges.forEach(function (edge) {
  var f = route.calculateLinearEquation(edge.a, edge.b);
  console.log(edge.a.longitude, edge.b.longitude);
  for (var i = edge.a.longitude; i < edge.b.longitude; i++) {
    console.log(i);
  }
  console.log();
});