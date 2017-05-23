'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Graph = require('./Graph');

var _Graph2 = _interopRequireDefault(_Graph);

var _Ant = require('./Ant');

var _Ant2 = _interopRequireDefault(_Ant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Colony = function () {
  function Colony() {
    _classCallCheck(this, Colony);

    this._graph = new _Graph2.default();
    this._colony = [];

    // Set default params
    this._colonySize = 1; // 20
    this._alpha = 1;
    this._beta = 3;
    this._rho = 0.1;
    this._q = 1;
    this._initPheromone = this._q;
    this._type = 'maxmin'; //acs
    this._elitistWeight = 0;
    this._maxIterations = 1; //250
    this._minScalingFactor = 0.001;
    this._maxDistance = 34;

    this._iteration = 0;
    this._minPheromone = null;
    this._maxPheromone = null;

    this._iterationBest = null;
    this._globalBest = null;

    this._createAnts();
  }

  _createClass(Colony, [{
    key: 'getGraph',
    value: function getGraph() {
      return this._graph;
    }
  }, {
    key: 'getAnts',
    value: function getAnts() {
      return this._colony;
    }
  }, {
    key: 'size',
    value: function size() {
      return this._colony.length;
    }
  }, {
    key: 'currentIteration',
    value: function currentIteration() {
      return this._iteration;
    }
  }, {
    key: 'maxIterations',
    value: function maxIterations() {
      return this._maxIterations;
    }
  }, {
    key: '_createAnts',
    value: function _createAnts() {
      this._colony = [];
      for (var antIndex = 0; antIndex < this._colonySize; antIndex++) {
        this._colony.push(new _Ant2.default(this._graph, {
          'alpha': this._alpha,
          'beta': this._beta,
          'q': this._q,
          'maxDistance': this._maxDistance
        }));
      }
    }
  }, {
    key: 'reset',
    value: function reset() {
      this._iteration = 0;
      this._globalBest = null;
      this.resetAnts();
      this.setInitialPheromone(this._initPheromone);
      this._graph.resetPheromone();
    }
  }, {
    key: 'setInitialPheromone',
    value: function setInitialPheromone() {
      var edges = this._graph.getEdges();
      for (var edgeIndex in edges) {
        edges[edgeIndex].setInitialPheromone(this._initPheromone);
      }
    }
  }, {
    key: 'resetAnts',
    value: function resetAnts() {
      this._createAnts();
      this._iterationBest = null;
    }
  }, {
    key: 'ready',
    value: function ready() {
      return this._graph.size() > 1;
    }
  }, {
    key: 'run',
    value: function run() {
      if (!this.ready()) {
        return;
      }

      this._iteration = 0;
      while (this._iteration < this._maxIterations) {
        this.step();
      }
    }
  }, {
    key: 'step',
    value: function step() {
      if (!this.ready() || this._iteration >= this._maxIterations) {
        return;
      }

      this.resetAnts();

      for (var antIndex in this._colony) {
        this._colony[antIndex].run();
      }

      this.getGlobalBest();
      this.updatePheromone();

      this._iteration++;
    }
  }, {
    key: 'updatePheromone',
    value: function updatePheromone() {
      var edges = this._graph.getEdges();
      var best = void 0;

      for (var edgeIndex in edges) {
        var pheromone = edges[edgeIndex].getPheromone();
        edges[edgeIndex].setPheromone(pheromone * (1 - this._rho));
      }

      if (this._type == 'maxmin') {
        if (this._iteration / this._maxIterations > 0.75) {
          //0.75
          best = this.getGlobalBest();
        } else {
          best = this.getIterationBest();
        }

        // Set maxmin
        this._maxPheromone = this._q / best.getTour().distance();
        this._minPheromone = this._maxPheromone * this._minScalingFactor;

        best.addPheromone();
      } else {
        for (var antIndex in this._colony) {
          this._colony[antIndex].addPheromone();
        }
      }

      if (this._type == 'elitist') {
        this.getGlobalBest().addPheromone(this._elitistWeight);
      }

      if (this._type == 'maxmin') {
        for (var edgeIndex in edges) {
          var _pheromone = edges[edgeIndex].getPheromone();
          if (_pheromone > this._maxPheromone) {
            edges[edgeIndex].setPheromone(this._maxPheromone);
          } else if (_pheromone < this._minPheromone) {
            edges[edgeIndex].setPheromone(this._minPheromone);
          }
        }
      }
    }
  }, {
    key: 'getIterationBest',
    value: function getIterationBest() {
      if (this._colony[0].getTour() == null) {
        return null;
      }

      if (this._iterationBest == null) {
        var bestIndex = 0;
        var bestValue = this._colony[bestIndex].getTour().value;

        for (var antIndex in this._colony) {
          var value = this._colony[antIndex].getTour().value;
          if (value > bestValue) {
            bestIndex = antIndex;
            bestValue = value;
          }
        }

        this._iterationBest = this._colony[bestIndex];
      }

      return this._iterationBest;
    }
  }, {
    key: 'getGlobalBest',
    value: function getGlobalBest() {
      var bestAnt = this.getIterationBest();
      if (bestAnt == null && this._globalBest == null) {
        return null;
      }

      if (bestAnt != null) {
        if (this._globalBest == null || this._globalBest.getTour().value >= bestAnt.getTour().value) {
          this._globalBest = bestAnt;
        }
      }

      return this._globalBest;
    }
  }]);

  return Colony;
}();

exports.default = Colony;
//# sourceMappingURL=Colony.js.map