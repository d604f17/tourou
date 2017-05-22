import haversine from 'haversine';

export default class Edge {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }

  get haversineDistance() {
    return Math.round(haversine(this.a, this.b, {unit: 'meter'}));
  }

  get linearEquation() {
    const m = (this.b.latitude - this.a.latitude) / (this.b.longitude - this.a.longitude);

    return function(x) {
      return m * x - m * this.a.longitude + this.a.latitude;
    };
  }
}
