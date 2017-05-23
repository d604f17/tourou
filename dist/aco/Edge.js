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
  function Edge(vertexA, vertexB) {
    _classCallCheck(this, Edge);

    this._vertexA = vertexA;
    this._vertexB = vertexB;
    this._initPheromone = 1;
    this._pheromone = this._initPheromone;

    var coordA = { latitude: vertexA.y, longitude: vertexA.x };
    var coordB = { latitude: vertexB.y, longitude: vertexB.x };
    this._distance = (0, _haversine2.default)(coordA, coordB, { unit: 'meter' });
  }

  _createClass(Edge, [{
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
  }]);

  return Edge;
}();

exports.default = Edge;
//# sourceMappingURL=Edge.js.map