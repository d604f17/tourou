import haversine from 'haversine';

export default class Edge {
  constructor(a, b) {
    this.a = a;
    this.b = b;
    this.haversineDistance = Math.round(haversine(a, b, {unit: 'meter'}));
  }
}
