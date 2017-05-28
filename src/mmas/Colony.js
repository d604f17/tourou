import readline from 'readline';
import Graph from './Graph';
import Ant from './Ant';

class Colony {
  constructor(params) {
    this._graph = new Graph();
    this._colony = [];

    // Set default params
    this._colonySize = params && params['colonySize'] ? params['colonySize'] : 30;
    this._alpha = params && params['alpha'] ? params['alpha'] : 1;
    this._beta = params && params['beta'] ? params['beta'] : 3;
    this._rho = params && params['rho'] ? params['rho'] : 0.1;
    this._q = params && params['q'] ? params['q'] : 1;
    this._initPheromone = params && params['initPheromone'] ? params['initPheromone'] : this._q;
    this._type = 'maxmin'; //acs
    this._elitistWeight = params && params['elitistWeight'] ? params['elitistWeight'] : 0;
    this._maxIterations = params && params['maxIterations'] ? params['maxIterations'] : 200;
    this._minScalingFactor = params && params['minScalingFactor'] ?params['minScalingFactor'] :0.001;
    this._maxDistance = params && params['maxDistance'] ?params['maxDistance'] : 20000;

    this._iteration = 0;
    this._minPheromone = null;
    this._maxPheromone = null;

    this._iterationBest = null;
    this._globalBest = null;

    this._createAnts();
  }

  getGraph() {
    return this._graph;
  }

  getAnts() {
    return this._colony;
  }

  size() {
    return this._colony.length;
  }

  currentIteration() {
    return this._iteration;
  }

  maxIterations() {
    return this._maxIterations;
  }

  _createAnts() {
    this._colony = [];
    for (var antIndex = 0; antIndex < this._colonySize; antIndex++) {
      this._colony.push(new Ant(this._graph, {
        'alpha': this._alpha,
        'beta': this._beta,
        'q': this._q,
        'maxDistance': this._maxDistance,
      }));
    }
  }

  reset() {
    this._iteration = 0;
    this._globalBest = null;
    this.resetAnts();
    this.setInitialPheromone(this._initPheromone);
    this._graph.resetPheromone();
  }

  setInitialPheromone() {
    const edges = this._graph.getEdges();
    for (var edgeIndex in edges) {
      edges[edgeIndex].setInitialPheromone(this._initPheromone);
    }
  }

  resetAnts() {
    this._createAnts();
    this._iterationBest = null;
  }

  ready() {
    return this._graph.size() > 1;
  }

  run() {
    if (!this.ready()) {
      return;
    }

    this._iteration = 0;

    function writeWaitingPercent(p, m) {
      readline.clearLine(process.stdout);
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(`running mmas ${p}% - ${m} minutes left. `);
    }

    let times = [];

    while (this._iteration < this._maxIterations) {
      var start = new Date().getTime();
      this.step();
      var end = new Date().getTime();
      times.push(end - start);

      let averageTimePerIteration = times.reduce((a, b) => a + b) / times.length;
      let timeLeft = (this._maxIterations - this._iteration) * averageTimePerIteration;
      let percentage = Math.round((this._iteration / this._maxIterations) * 100);
      let minutes = ((timeLeft / 1000) / 60).toFixed(2);

      writeWaitingPercent(percentage, minutes);
    }
    console.log('');
  }

  step() {
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

  updatePheromone() {
    const edges = this._graph.getEdges();
    let best;

    for (var edgeIndex in edges) {
      const pheromone = edges[edgeIndex].getPheromone();
      edges[edgeIndex].setPheromone(pheromone * (1 - this._rho));
    }

    if (this._type == 'maxmin') {
      if ((this._iteration / this._maxIterations) > 0.75) { //0.75
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
        const pheromone = edges[edgeIndex].getPheromone();
        if (pheromone > this._maxPheromone) {
          edges[edgeIndex].setPheromone(this._maxPheromone);
        } else if (pheromone < this._minPheromone) {
          edges[edgeIndex].setPheromone(this._minPheromone);
        }
      }
    }
  }

  getIterationBest() {
    if (this._colony[0].getTour() == null) {
      return null;
    }

    if (this._iterationBest == null) {
      let bestIndex = 0;
      let bestValue = this._colony[bestIndex].getTour().value;

      for (var antIndex in this._colony) {
        const value = this._colony[antIndex].getTour().value;
        if (value > bestValue) {
          bestIndex = antIndex;
          bestValue = value;
        }
      }

      this._iterationBest = this._colony[bestIndex];
    }

    return this._iterationBest;
  }

  getGlobalBest() {
    const bestAnt = this.getIterationBest();
    if (bestAnt == null && this._globalBest == null) {
      return null;
    }

    if (bestAnt != null) {
      if (this._globalBest == null ||
          this._globalBest.getTour().value >= bestAnt.getTour().value) {
        this._globalBest = bestAnt;
      }
    }

    return this._globalBest;
  }
}

export default Colony;