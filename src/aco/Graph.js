import Vertex from './Vertex';
import Edge from './Edge';

class Graph {
  constructor() {
    this._vertices = [];
    this._edges = {};
  }

  getEdges() {
    return this._edges;
  }

  getEdgeCount() {
    return Object.keys(this._edges).length;
  }

  getVertex(vertexIndex) {
    return this._vertices[vertexIndex];
  }

  getVertices() {
    return this._vertices;
  }

  size() {
    return this._vertices.length;
  }

  addVertex(x, y, value) {
    this._vertices.push(new Vertex(x, y, value));
  }

  _addEdge(vertexA, vertexB) {
    this._edges[vertexA.toString() + '-' + vertexB.toString()] = new Edge(vertexA, vertexB);
  }

  getEdge(vertexA, vertexB) {
    if (this._edges[vertexA.toString() + '-' + vertexB.toString()] != undefined) {
      return this._edges[vertexA.toString() + '-' + vertexB.toString()];
    }
    if (this._edges[vertexB.toString() + '-' + vertexA.toString()] != undefined) {
      return this._edges[vertexB.toString() + '-' + vertexA.toString()];
    }
  }

  createEdges() {
    this._edges = {};

    for (var vertexIndex = 0; vertexIndex < this._vertices.length; vertexIndex++) {
      for (var connectionIndex = vertexIndex; connectionIndex <
      this._vertices.length; connectionIndex++) {
        this._addEdge(this._vertices[vertexIndex], this._vertices[connectionIndex]);
      }
    }
  }

  resetPheromone() {
    for (var edgeIndex in this._edges) {
      this._edges[edgeIndex].resetPheromone();
    }
  }
}

export default Graph;