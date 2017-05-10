'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _Edge = require('./Edge');

var _Edge2 = _interopRequireDefault(_Edge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Route = function () {
  function Route(a, b) {
    _classCallCheck(this, Route);

    this.edges = [new _Edge2.default(a, b)];
    this.setValueAndDistanceAndWaypoints();
    this.hash = this.getHashCode();

    //this.distance = start.getDistanceToWaypoint(end);
    //this.waypoints = [start, end];
  }

  _createClass(Route, [{
    key: 'add',
    value: function add(waypoint) {
      this.edges.push(new _Edge2.default(_underscore2.default.last(this.edges).b, waypoint));
      this.setValueAndDistanceAndWaypoints();
    }
  }, {
    key: 'containsWaypoint',
    value: function containsWaypoint(waypoint) {
      return _underscore2.default.contains(this.waypoints, waypoint);
    }
  }, {
    key: 'setValueAndDistanceAndWaypoints',
    value: function setValueAndDistanceAndWaypoints() {
      var _this = this;

      var value = 0;
      var distance = 0;
      var waypoints = [];

      this.edges.forEach(function (edge, index) {
        value += edge.a.value;
        distance += edge.haversineDistance;
        waypoints.push(edge.a);

        if (index === _this.edges.length - 1) {
          value += edge.b.value;
          waypoints.push(edge.b);
        }
      });

      this.value = value;
      this.distance = distance;
      this.waypoints = waypoints;
    }

    //
    // addWaypoint(waypoint) {
    //   this.value += waypoint.value;
    //   this.distance += _.last(this.waypoints).getDistanceToWaypoint(waypoint);
    //   this.waypoints.push(waypoint);
    //   this.hash = this.getHashCode();
    // }
    //

  }, {
    key: 'getHashCode',
    value: function getHashCode() {
      var waypoints = [].concat(_toConsumableArray(this.waypoints));
      var start = waypoints.shift();
      var end = waypoints.pop();

      var hash = start.id + ':';

      if (waypoints.length) {
        waypoints.sort(function (a, b) {
          return a.id - b.id;
        });
        hash += waypoints.map(function (waypoint) {
          return waypoint.id;
        }).join(':') + ':';
      }

      return hash + ('' + end.id);
    }
  }]);

  return Route;
}();

exports.default = Route;