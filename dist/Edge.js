'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _haversine = require('haversine');

var _haversine2 = _interopRequireDefault(_haversine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Edge = function Edge(a, b) {
  _classCallCheck(this, Edge);

  this.a = a;
  this.b = b;
  this.haversineDistance = Math.round((0, _haversine2.default)(a, b, { unit: 'meter' }));
};

exports.default = Edge;