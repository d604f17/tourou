class Vertex {
  constructor(x, y, value) {
    this._x = x;
    this._y = y;
    this._value = value;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  get value() {
    return this._value;
  }

  toString() {
    return this.x + ',' + this.y;
  }

  isEqual(vertex) {
    return this.x == vertex.x && this.y == vertex.y;
  }
}

export default Vertex;