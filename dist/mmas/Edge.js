'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _haversine = require('haversine');

var _haversine2 = _interopRequireDefault(_haversine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Edge = function () {
  function Edge(vertexA, vertexB, boxes) {
    _classCallCheck(this, Edge);

    this._vertexA = vertexA;
    this._vertexB = vertexB;
    this._initPheromone = 1;
    this._pheromone = this._initPheromone;
    this._boxes = boxes;
    this._multiplier = this.calculateMultiplier();

    var coordA = { latitude: vertexA.y, longitude: vertexA.x };
    var coordB = { latitude: vertexB.y, longitude: vertexB.x };
    this._distance = Math.round((0, _haversine2.default)(coordA, coordB, { unit: 'meter' })) * this._multiplier;
  }

  _createClass(Edge, [{
    key: 'calculateMultiplier',
    value: function calculateMultiplier() {
      var _this = this;

      var sum = [],
          edgeLatitudeRange = [this._vertexA.y, this._vertexB.y];

      edgeLatitudeRange.sort(function (a, b) {
        return a - b;
      });

      this._boxes.forEach(function (box) {
        var boundLatitudeRange = [box.n, box.s];

        boundLatitudeRange.sort(function (a, b) {
          return a - b;
        });

        var isYWithinEdgeAndBox = function isYWithinEdgeAndBox(y) {
          return edgeLatitudeRange[0] <= y && edgeLatitudeRange[1] >= y && boundLatitudeRange[0] <= y && boundLatitudeRange[1] >= y;
        };

        var isEdgeAWithinBox = _this._vertexA.x >= box.w && _this._vertexA.x <= box.e && _this._vertexA.y >= box.s && _this._vertexA.y <= box.n;

        var isEdgeBWithinBox = _this._vertexB.x >= box.w && _this._vertexB.x <= box.e && _this._vertexB.y >= box.s && _this._vertexB.y <= box.n;

        var hasEdgePassed = isEdgeAWithinBox || isEdgeBWithinBox || isYWithinEdgeAndBox(_this.linearEquation(box.w)) || isYWithinEdgeAndBox(_this.linearEquation(box.e));

        if (hasEdgePassed) {
          sum.push(box.multiplier);
        }
      });

      if (sum.length) {
        return sum.reduce(function (a, b) {
          return a + b;
        }) / sum.length;
      } else {
        return 1;
      }
    }
  }, {
    key: 'pointA',
    value: function pointA() {
      return { 'x': this._vertexA.x, 'y': this._vertexA.y };
    }
  }, {
    key: 'pointB',
    value: function pointB() {
      return { 'x': this._vertexB.x, 'y': this._vertexB.y };
    }
  }, {
    key: 'getPheromone',
    value: function getPheromone() {
      return this._pheromone;
    }
  }, {
    key: 'getDistance',
    value: function getDistance() {
      return this._distance;
    }
  }, {
    key: 'contains',
    value: function contains(vertex) {
      if (this._vertexA.x == vertex.x) {
        return true;
      }

      if (this._vertexB.x == vertex.x) {
        return true;
      }

      return false;
    }
  }, {
    key: 'setInitialPheromone',
    value: function setInitialPheromone(pheromone) {
      this._initPheromone = pheromone;
    }
  }, {
    key: 'setPheromone',
    value: function setPheromone(pheromone) {
      this._pheromone = pheromone;
    }
  }, {
    key: 'resetPheromone',
    value: function resetPheromone() {
      this._pheromone = this._initPheromone;
    }
  }, {
    key: 'linearEquation',
    get: function get() {
      var _this2 = this;

      var m = (this._vertexB.y - this._vertexA.y) / (this._vertexB.x - this._vertexA.x);

      return function (x) {
        return m * x - m * _this2._vertexA.x + _this2._vertexA.y;
      };
    }
  }]);

  return Edge;
}();

exports.default = Edge;
//# sourceMappingURL=Edge.js.map