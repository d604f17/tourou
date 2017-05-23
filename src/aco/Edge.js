import haversine from 'haversine';

class Edge {
  constructor(vertexA, vertexB) {
    this._vertexA = vertexA;
    this._vertexB = vertexB;
    this._initPheromone = 1;
    this._pheromone = this._initPheromone;

    const coordA = {latitude: vertexA.y, longitude: vertexA.x};
    const coordB = {latitude: vertexB.y, longitude: vertexB.x};
    this._distance = Math.round(haversine(coordA, coordB, {unit: 'meter'}));
  }

  pointA() {
    return {'x': this._vertexA.x, 'y': this._vertexA.y};
  }

  pointB() {
    return {'x': this._vertexB.x, 'y': this._vertexB.y};
  }

  getPheromone() {
    return this._pheromone;
  }

  getDistance() {
    return this._distance;
  }

  contains(vertex) {
    if (this._vertexA.x == vertex.x) {
      return true;
    }

    if (this._vertexB.x == vertex.x) {
      return true;
    }

    return false;
  }

  setInitialPheromone(pheromone) {
    this._initPheromone = pheromone;
  }

  setPheromone(pheromone) {
    this._pheromone = pheromone;
  }

  resetPheromone() {
    this._pheromone = this._initPheromone;
  }
}

export default Edge;