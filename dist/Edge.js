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
  function Edge(a, b) {
    _classCallCheck(this, Edge);

    this.a = a;
    this.b = b;
    this.haversineDistance = Math.round((0, _haversine2.default)(a, b, { unit: 'meter' }));
    this.EquSolveForX = this.calculateLinearEquationSolveForX();
    this.EquSolveForY = this.calculateLinearEquationSolveForY();
  }

  _createClass(Edge, [{
    key: 'calculateLinearEquationSolveForY',
    value: function calculateLinearEquationSolveForY() {
      var m = (this.b.latitude - this.a.latitude) / (this.b.longitude - this.a.longitude);

      return function (x) {
        return m * x - m * this.a.longitude + this.a.latitude;
      };
    }
  }, {
    key: 'calculateLinearEquationSolveForX',
    value: function calculateLinearEquationSolveForX() {
      var m = (this.b.latitude - this.a.latitude) / (this.b.longitude - this.a.longitude);

      return function (y) {
        return (y - this.a.latitude + m * this.a.longitude) / m;
      };
    }
  }]);

  return Edge;
}();

exports.default = Edge;