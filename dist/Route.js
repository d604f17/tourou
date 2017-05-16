'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _extend = require('extend');

var _extend2 = _interopRequireDefault(_extend);

var _Edge = require('./Edge');

var _Edge2 = _interopRequireDefault(_Edge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Route = function () {
  function Route(a, b, boundedBoxes) {
    _classCallCheck(this, Route);

    if (a && b) {
      this.edges = [new _Edge2.default(a, b)];
      this.boundedBoxes = boundedBoxes;
      this.setValueAndDistanceAndWaypoints();
      this.hash = this.getHashCode();
    }
  }

  _createClass(Route, [{
    key: 'calcMultiplier',
    value: function calcMultiplier(edge) {
      var sum = [];

      this.boundedBoxes.forEach(function (bound) {
        var edgeLatRange = [];
        var boundLatRange = [];

        if (edge.a.latitude > edge.b.latitude) {
          edgeLatRange[0] = edge.b.latitude;
          edgeLatRange[1] = edge.a.latitude;
        } else {
          edgeLatRange[0] = edge.a.latitude;
          edgeLatRange[1] = edge.b.latitude;
        }

        if (bound.nw[1] > bound.se[1]) {
          boundLatRange[0] = bound.se[1];
          boundLatRange[1] = bound.nw[1];
        } else {
          boundLatRange[0] = bound.nw[1];
          boundLatRange[1] = bound.se[1];
        }

        var check = function check(y) {
          return edgeLatRange[0] <= y && edgeLatRange[1] >= y && boundLatRange[0] <= y && boundLatRange[1] >= y;
        };

        var edgeAWithinBox = bound.nw[0] <= edge.a.latitude && bound.nw[1] <= edge.a.longitude && bound.se[0] >= edge.a.latitude && bound.se[1] >= edge.a.longitude;

        var edgeBWithinBox = bound.nw[0] <= edge.b.latitude && bound.nw[1] <= edge.b.longitude && bound.se[0] >= edge.b.latitude && bound.se[1] >= edge.b.longitude;

        if (edgeAWithinBox || edgeBWithinBox || check(edge.equSolveForY(bound.nw[0])) || check(edge.equSolveForY(bound.se[0]))) {
          sum.push(bound.multiplier);
        }
      });

      if (sum.length) return edge.multiplier = sum.reduce(function (a, b) {
        return a + b;
      }) / sum.length;else {
        return 1;
      }
    }
  }, {
    key: 'add',
    value: function add(waypoint) {
      this.edges.push(new _Edge2.default(_underscore2.default.last(this.edges).b, waypoint));
      this.setValueAndDistanceAndWaypoints();
      this.hash = this.getHashCode();
    }
  }, {
    key: 'clone',
    value: function clone() {
      return (0, _extend2.default)(true, new Route(), this);
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

        distance += edge.haversineDistance * _this.calcMultiplier(edge);
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

    // calculateLinearEquation(a, b) {
    //   const m = (b.latitude - a.latitude) / (b.longitude - a.longitude);
    //
    //   return function(x) {
    //     return m * x - m * a.longitude + a.latitude;
    //   };
    // }

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