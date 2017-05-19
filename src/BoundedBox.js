import Edge from './Edge.js';

class BoundedBox {
  constructor(nw, se) {
    this.nw = nw;
    this.se = se;
  }

  get n() {
    return this.nw[1];
  }

  get w() {
    return this.nw[0];
  }

  get s() {
    return this.se[1];
  }

  get e() {
    return this.se[0];
  }

  get edge() {
    const a = {longitude: this.w, latitude: this.n};
    const b = {longitude: this.e, latitude: this.s};
    return new Edge(a, b);
  }

  static generateFromWaypoints(waypoints) {
    let minLat, minLon, maxLat, maxLon;
    minLat = minLon = Number.MAX_VALUE;
    maxLat = maxLon = Number.MIN_VALUE;

    waypoints.forEach(waypoint => {
      if (waypoint.latitude < minLat) minLat = waypoint.latitude;
      if (waypoint.latitude > maxLat) maxLat = waypoint.latitude;
      if (waypoint.longitude < minLon) minLon = waypoint.longitude;
      if (waypoint.longitude > maxLon) maxLon = waypoint.longitude;
    });

    return new BoundedBox([minLon, maxLat], [maxLon, minLat]);
  }
}

export default BoundedBox;