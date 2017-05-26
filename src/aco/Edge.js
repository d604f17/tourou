import haversine from 'haversine';

class Edge {
  constructor(vertexA, vertexB, boxes) {
    this._vertexA = vertexA;
    this._vertexB = vertexB;
    this._initPheromone = 1;
    this._pheromone = this._initPheromone;
    this._boxes = boxes;
    this._multiplier = this.calculateMultiplier();

    const coordA = {latitude: vertexA.y, longitude: vertexA.x};
    const coordB = {latitude: vertexB.y, longitude: vertexB.x};
    this._distance = Math.round(haversine(coordA, coordB, {unit: 'meter'})) * this._multiplier;
  }

  get linearEquation() {
    const m = (this._vertexB.y - this._vertexA.y) / (this._vertexB.x - this._vertexA.x);

    return (x) => {
      return m * x - m * this._vertexA.x + this._vertexA.y;
    };
  }

  calculateMultiplier() {
    let sum = [], edgeLatitudeRange = [this._vertexA.y, this._vertexB.y];

    edgeLatitudeRange.sort((a, b) => a - b);

    this._boxes.forEach(box => {
      let boundLatitudeRange = [box.n, box.s];

      boundLatitudeRange.sort((a, b) => a - b);

      const isYWithinEdgeAndBox = (y) => (
          edgeLatitudeRange[0] <= y &&
          edgeLatitudeRange[1] >= y &&
          boundLatitudeRange[0] <= y &&
          boundLatitudeRange[1] >= y
      );

      const isEdgeAWithinBox = this._vertexA.x >= box.w &&
          this._vertexA.x <= box.e &&
          this._vertexA.y >= box.s &&
          this._vertexA.y <= box.n;

      const isEdgeBWithinBox = this._vertexB.x >= box.w &&
          this._vertexB.x <= box.e &&
          this._vertexB.y >= box.s &&
          this._vertexB.y <= box.n;

      const hasEdgePassed = isEdgeAWithinBox ||
          isEdgeBWithinBox ||
          isYWithinEdgeAndBox(this.linearEquation(box.w)) ||
          isYWithinEdgeAndBox(this.linearEquation(box.e));

      if (hasEdgePassed) {
        sum.push(box.multiplier);
      }
    });

    if (sum.length) {
      return sum.reduce((a, b) => a + b) / sum.length;
    }
    else {
      return 1;
    }
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