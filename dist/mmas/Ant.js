'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Tour = require('./Tour');

var _Tour2 = _interopRequireDefault(_Tour);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Ant = function () {
  function Ant(graph, params) {
    _classCallCheck(this, Ant);

    this._graph = graph;

    this._alpha = params.alpha;
    this._beta = params.beta;
    this._q = params.q;
    this._maxDistance = params.maxDistance;
    this._tour = null;
  }

  _createClass(Ant, [{
    key: 'reset',
    value: function reset() {
      this._tour = null;
    }
  }, {
    key: 'init',
    value: function init() {
      this._tour = new _Tour2.default(this._graph);
      this._currentVertex = this._graph.getVertex(0);
      this._tour.addVertex(this._currentVertex);
    }
  }, {
    key: 'getTour',
    value: function getTour() {
      return this._tour;
    }
  }, {
    key: 'makeNextMove',
    value: function makeNextMove() {
      if (this._tour == null) {
        this.init();
      }

      var rouletteWheel = 0.0;
      var vertices = this._graph.getVertices();

      var vertexProbabilities = [];
      var finalPheromoneWeight = void 0;
      var forwardMovePossible = false;

      var timeSpendAtAttraction = 2500; // 30 mins

      for (var vertexIndex in vertices) {
        var vertex = vertices[vertexIndex];
        var edgeForwardDistance = this._graph.getEdge(this._tour.getLast(), vertex).getDistance();
        var edgeHomeDistance = this._graph.getEdge(vertex, vertices[0]).getDistance();

        if (!this._tour.contains(vertices[vertexIndex]) && this._maxDistance >= timeSpendAtAttraction + this._tour.distance() + edgeForwardDistance + edgeHomeDistance) {

          var edge = this._graph.getEdge(this._currentVertex, vertices[vertexIndex]);
          if (this._alpha == 1) {
            finalPheromoneWeight = edge.getPheromone();
          } else {
            finalPheromoneWeight = Math.pow(edge.getPheromone(), this._alpha);
          }
          vertexProbabilities[vertexIndex] = finalPheromoneWeight * Math.pow(1.0 / edge.getDistance(), this._beta);
          rouletteWheel += vertexProbabilities[vertexIndex];
          forwardMovePossible = true;
        }
      }

      if (forwardMovePossible) {
        var wheelTarget = rouletteWheel * Math.random();

        var wheelPosition = 0.0;
        for (var vertexIndex in vertices) {
          var _vertex = vertices[vertexIndex];
          var _edgeForwardDistance = this._graph.getEdge(this._tour.getLast(), _vertex).getDistance();
          var _edgeHomeDistance = this._graph.getEdge(_vertex, vertices[0]).getDistance();

          if (!this._tour.contains(vertices[vertexIndex]) && this._maxDistance >= timeSpendAtAttraction + this._tour.distance() + _edgeForwardDistance + _edgeHomeDistance) {

            wheelPosition += vertexProbabilities[vertexIndex];
            if (wheelPosition >= wheelTarget) {
              this._currentVertex = vertices[vertexIndex];
              this._tour.addVertex(vertices[vertexIndex]);
              return;
            }
          }
        }
      } else {
        this._currentVertex = vertices[0];
        this._tour.addVertex(vertices[0]);
      }
    }
  }, {
    key: 'tourFound',
    value: function tourFound() {
      if (this._tour == null) {
        return false;
      }

      return this._graph.getVertices()[0].isEqual(this.getTour().getLast());
    }
  }, {
    key: 'run',
    value: function run() {
      this.reset();
      while (!this.tourFound()) {
        this.makeNextMove();
      }
    }
  }, {
    key: 'addPheromone',
    value: function addPheromone(weight) {
      var fromVertex = void 0,
          toVertex = void 0,
          edge = void 0,
          pheromone = void 0;

      if (weight == undefined) {
        weight = 1;
      }

      var extraPheromone = this._q * weight / this._tour.distance();
      for (var tourIndex = 0; tourIndex < this._tour.size(); tourIndex++) {
        if (tourIndex >= this._tour.size() - 1) {
          fromVertex = this._tour.get(tourIndex);
          toVertex = this._tour.get(0);
          edge = this._graph.getEdge(fromVertex, toVertex);
          pheromone = edge.getPheromone();
          edge.setPheromone(pheromone + extraPheromone);
        } else {
          fromVertex = this._tour.get(tourIndex);
          toVertex = this._tour.get(tourIndex + 1);
          edge = this._graph.getEdge(fromVertex, toVertex);
          pheromone = edge.getPheromone();
          edge.setPheromone(pheromone + extraPheromone);
        }
      }
    }
  }]);

  return Ant;
}();

exports.default = Ant;
//# sourceMappingURL=Ant.js.map