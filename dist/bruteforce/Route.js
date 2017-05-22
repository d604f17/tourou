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
      // console.time('contains');
      var result = _underscore2.default.contains(this.waypoints, waypoint);
      // console.timeEnd('contains');
      return result;
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
        distance += edge.haversineDistance * _this.calculateMultiplier(edge);
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
  }, {
    key: 'calculateMultiplier',
    value: function calculateMultiplier(edge) {
      var sum = [];
      var edgeLatitudeRange = [edge.a.latitude, edge.b.latitude];

      edgeLatitudeRange.sort(function (a, b) {
        return a - b;
      });

      var errors = [];

      this.boundedBoxes.forEach(function (box) {
        var boundLatitudeRange = [box.n, box.s];

        boundLatitudeRange.sort(function (a, b) {
          return a - b;
        });

        var isYWithinEdgeAndBox = function isYWithinEdgeAndBox(y) {
          return edgeLatitudeRange[0] <= y && edgeLatitudeRange[1] >= y && boundLatitudeRange[0] <= y && boundLatitudeRange[1] >= y;
        };

        var isEdgeAWithinBox = edge.a.longitude >= box.w && edge.a.longitude <= box.e && edge.a.latitude >= box.s && edge.a.latitude <= box.n;

        var isEdgeBWithinBox = edge.b.longitude >= box.w && edge.b.longitude <= box.e && edge.b.latitude >= box.s && edge.b.latitude <= box.n;

        var hasEdgePassed = isEdgeAWithinBox || isEdgeBWithinBox || isYWithinEdgeAndBox(edge.linearEquation(box.w)) || isYWithinEdgeAndBox(edge.linearEquation(box.e));

        if (hasEdgePassed) {
          sum.push(box.multiplier);
        }
      });

      if (sum.length) {
        return edge.multiplier = sum.reduce(function (a, b) {
          return a + b;
        }) / sum.length;
      } else {
        return edge.multiplier = 1;
      }
    }
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
//# sourceMappingURL=Route.js.map