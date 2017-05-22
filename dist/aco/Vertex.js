'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Vertex = function () {
  function Vertex(x, y, value) {
    _classCallCheck(this, Vertex);

    this._x = x;
    this._y = y;
    this._value = value;
  }

  _createClass(Vertex, [{
    key: 'toString',
    value: function toString() {
      return this.x + ',' + this.y;
    }
  }, {
    key: 'isEqual',
    value: function isEqual(vertex) {
      return this.x === vertex.x && this.y === vertex.y;
    }
  }, {
    key: 'x',
    get: function get() {
      return this._x;
    }
  }, {
    key: 'y',
    get: function get() {
      return this._y;
    }
  }, {
    key: 'value',
    get: function get() {
      return this._value;
    }
  }]);

  return Vertex;
}();

exports.default = Vertex;
//# sourceMappingURL=Vertex.js.map