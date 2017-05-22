"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tour = function () {
  function Tour(graph) {
    _classCallCheck(this, Tour);

    this._graph = graph;
    this._tour = [];
    this._distance = null;
  }

  _createClass(Tour, [{
    key: "size",
    value: function size() {
      return this._tour.length;
    }
  }, {
    key: "contains",
    value: function contains(vertex) {
      for (var tourIndex in this._tour) {
        if (vertex.isEqual(this._tour[tourIndex])) {
          return true;
        }
      }

      return false;
    }
  }, {
    key: "addVertex",
    value: function addVertex(vertex) {
      this._distance = null;
      this._tour.push(vertex);
    }
  }, {
    key: "get",
    value: function get(tourIndex) {
      return this._tour[tourIndex];
    }
  }, {
    key: "getLast",
    value: function getLast() {
      return this._tour[this.size() - 1];
    }
  }, {
    key: "distance",
    value: function distance() {
      if (this._distance === null) {
        var distance = 0.0,
            edge = void 0;

        for (var tourIndex = 0; tourIndex < this._tour.length; tourIndex++) {
          if (tourIndex >= this._tour.length - 1) {
            edge = this._graph.getEdge(this._tour[tourIndex], this._tour[0]);
            distance += edge.getDistance();
          } else {
            edge = this._graph.getEdge(this._tour[tourIndex], this._tour[tourIndex + 1]);
            distance += edge.getDistance();
          }
        }

        this._distance = distance;
      }

      return this._distance;
    }
  }]);

  return Tour;
}();

exports.default = Tour;
//# sourceMappingURL=Tour.js.map