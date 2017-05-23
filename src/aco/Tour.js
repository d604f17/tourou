class Tour {
  constructor(graph) {
    this._graph = graph;
    this._tour = [];
    this._distance = null;
    this._value = 0;
  }

  size() {
    return this._tour.length;
  }

  get value() {
    return this._value;
  }

  contains(vertex) {
    for (var tourIndex in this._tour) {
      if (vertex.isEqual(this._tour[tourIndex])) {
        return true;
      }
    }

    return false;
  }

  addVertex(vertex) {
    this._distance = null;
    this._tour.push(vertex);
    this._value += vertex.value;
  }

  get(tourIndex) {
    return this._tour[tourIndex];
  }

  getLast() {
    return this._tour[this.size() - 1];
  }

  distance() {
    if (this._distance == null) {
      let distance = 0.0;

      for (var i = 1; i < this._tour.length; i++) {
        distance += this._graph.getEdge(this._tour[i - 1], this._tour[i]).getDistance();
      }

      this._distance = distance;
    }

    return this._distance;
  }
}

export default Tour;