'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Vertex = require('./Vertex');

var _Vertex2 = _interopRequireDefault(_Vertex);

var _Edge = require('./Edge');

var _Edge2 = _interopRequireDefault(_Edge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Graph = function () {
  function Graph() {
    _classCallCheck(this, Graph);

    this._vertices = [];
    this._edges = {};
  }

  _createClass(Graph, [{
    key: 'getEdges',
    value: function getEdges() {
      return this._edges;
    }
  }, {
    key: 'getEdgeCount',
    value: function getEdgeCount() {
      return Object.keys(this._edges).length;
    }
  }, {
    key: 'getVertex',
    value: function getVertex(vertexIndex) {
      return this._vertices[vertexIndex];
    }
  }, {
    key: 'getVertices',
    value: function getVertices() {
      return this._vertices;
    }
  }, {
    key: 'size',
    value: function size() {
      return this._vertices.length;
    }
  }, {
    key: 'addVertex',
    value: function addVertex(x, y, value) {
      this._vertices.push(new _Vertex2.default(x, y, value));
    }
  }, {
    key: '_addEdge',
    value: function _addEdge(vertexA, vertexB) {
      this._edges[vertexA.toString() + '-' + vertexB.toString()] = new _Edge2.default(vertexA, vertexB);
    }
  }, {
    key: 'getEdge',
    value: function getEdge(vertexA, vertexB) {
      if (this._edges[vertexA.toString() + '-' + vertexB.toString()] != undefined) {
        return this._edges[vertexA.toString() + '-' + vertexB.toString()];
      }
      if (this._edges[vertexB.toString() + '-' + vertexA.toString()] != undefined) {
        return this._edges[vertexB.toString() + '-' + vertexA.toString()];
      }
    }
  }, {
    key: 'createEdges',
    value: function createEdges() {
      this._edges = {};

      for (var vertexIndex = 0; vertexIndex < this._vertices.length; vertexIndex++) {
        for (var connectionIndex = vertexIndex; connectionIndex < this._vertices.length; connectionIndex++) {
          this._addEdge(this._vertices[vertexIndex], this._vertices[connectionIndex]);
        }
      }
    }
  }, {
    key: 'resetPheromone',
    value: function resetPheromone() {
      for (var edgeIndex in this._edges) {
        this._edges[edgeIndex].resetPheromone();
      }
    }
  }]);

  return Graph;
}();

exports.default = Graph;
//# sourceMappingURL=Graph.js.map