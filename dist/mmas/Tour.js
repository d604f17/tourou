'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tour = function () {
  function Tour(graph) {
    _classCallCheck(this, Tour);

    this._graph = graph;
    this._tour = [];
    this._distance = null;
    this._value = 0;
  }

  _createClass(Tour, [{
    key: 'size',
    value: function size() {
      return this._tour.length;
    }
  }, {
    key: 'contains',
    value: function contains(vertex) {
      for (var tourIndex in this._tour) {
        if (vertex.isEqual(this._tour[tourIndex])) {
          return true;
        }
      }

      return false;
    }
  }, {
    key: 'addVertex',
    value: function addVertex(vertex) {
      this._distance = null;
      this._tour.push(vertex);
      this._value += vertex.value;
    }
  }, {
    key: 'get',
    value: function get(tourIndex) {
      return this._tour[tourIndex];
    }
  }, {
    key: 'getLast',
    value: function getLast() {
      return this._tour[this.size() - 1];
    }
  }, {
    key: 'distance',
    value: function distance() {
      if (this._distance == null) {
        var distance = 0.0;
        var timeSpendAtAttraction = 2500; // 30 mins

        for (var i = 1; i < this._tour.length; i++) {
          distance += this._graph.getEdge(this._tour[i - 1], this._tour[i]).getDistance();
        }

        if (_lodash2.default.isEqual(this._tour[0], this.getLast())) {
          distance += timeSpendAtAttraction * (this._tour.length - 2);
        } else {
          distance += timeSpendAtAttraction * (this._tour.length - 1);
        }

        this._distance = distance;
      }

      return this._distance;
    }
  }, {
    key: 'value',
    get: function get() {
      return this._value;
    }
  }]);

  return Tour;
}();

exports.default = Tour;
//# sourceMappingURL=Tour.js.map