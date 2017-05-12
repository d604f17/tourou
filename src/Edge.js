import haversine from 'haversine';

export default class Edge {
  constructor(a, b) {
    this.a = a;
    this.b = b;
    this.haversineDistance = Math.round(haversine(a, b, {unit: 'meter'}));
    this.EquSolveForX = this.calculateLinearEquationSolveForX();
    this.EquSolveForY = this.calculateLinearEquationSolveForY();
  }

  calculateLinearEquationSolveForY() {
    const m = (this.b.latitude - this.a.latitude) / (this.b.longitude - this.a.longitude);

    return function(x) {
      return m * x - m * this.a.longitude + this.a.latitude;
    };
  }

  calculateLinearEquationSolveForX() {
    const m = (this.b.latitude - this.a.latitude) / (this.b.longitude - this.a.longitude);

    return function(y) {
      return (y - this.a.latitude + m * this.a.longitude) / m;
    };
  }


}
