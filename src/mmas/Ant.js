import Tour from './Tour';

class Ant {
  constructor(graph, params) {
    this._graph = graph;

    this._alpha = params.alpha;
    this._beta = params.beta;
    this._q = params.q;
    this._maxDistance = params.maxDistance;
    this._tour = null;
  }

  reset() {
    this._tour = null;
  }

  init() {
    this._tour = new Tour(this._graph);
    this._currentVertex = this._graph.getVertex(0);
    this._tour.addVertex(this._currentVertex);
  }

  getTour() {
    return this._tour;
  }

  makeNextMove() {
    if (this._tour == null) {
      this.init();
    }

    let rouletteWheel = 0.0;
    const vertices = this._graph.getVertices();

    let vertexProbabilities = [];
    let finalPheromoneWeight;
    let forwardMovePossible = false;

    let timeSpendAtAttraction = 2500; // 30 mins

    for (var vertexIndex in vertices) {
      const vertex = vertices[vertexIndex];
      const edgeForwardDistance = this._graph.getEdge(this._tour.getLast(), vertex).getDistance();
      const edgeHomeDistance = this._graph.getEdge(vertex, vertices[0]).getDistance();

      if ((!this._tour.contains(vertices[vertexIndex]) &&
          (this._maxDistance >= timeSpendAtAttraction + this._tour.distance() + edgeForwardDistance + edgeHomeDistance))) {

        let edge = this._graph.getEdge(this._currentVertex, vertices[vertexIndex]);
        if (this._alpha == 1) {
          finalPheromoneWeight = edge.getPheromone();
        } else {
          finalPheromoneWeight = Math.pow(edge.getPheromone(), this._alpha);
        }
        vertexProbabilities[vertexIndex] = finalPheromoneWeight *
            Math.pow(1.0 / edge.getDistance(), this._beta);
        rouletteWheel += vertexProbabilities[vertexIndex];
        forwardMovePossible = true;
      }
    }

    if (forwardMovePossible) {
      const wheelTarget = rouletteWheel * Math.random();

      let wheelPosition = 0.0;
      for (var vertexIndex in vertices) {
        const vertex = vertices[vertexIndex];
        const edgeForwardDistance = this._graph.getEdge(this._tour.getLast(), vertex).getDistance();
        const edgeHomeDistance = this._graph.getEdge(vertex, vertices[0]).getDistance();

        if ((!this._tour.contains(vertices[vertexIndex]) &&
            (this._maxDistance >= timeSpendAtAttraction + this._tour.distance() + edgeForwardDistance + edgeHomeDistance))) {

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

  tourFound() {
    if (this._tour == null) {
      return false;
    }

    return this._graph.getVertices()[0].isEqual(this.getTour().getLast());
  }

  run() {
    this.reset();
    while (!this.tourFound()) {
      this.makeNextMove();
    }
  }

  addPheromone(weight) {
    let fromVertex, toVertex, edge, pheromone;

    if (weight == undefined) {
      weight = 1;
    }

    const extraPheromone = (this._q * weight) / this._tour.distance();
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
}

export default Ant;