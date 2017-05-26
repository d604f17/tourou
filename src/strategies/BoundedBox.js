import haversine from 'haversine';

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

  get haversineDistance() {
    const a = {longitude: this.w, latitude: this.n};
    const b = {longitude: this.e, latitude: this.s};
    return Math.round(haversine(a, b, {unit: 'meter'}));
  }

  static generateFromWaypoints(waypoints) {
    let minLat, minLon, maxLat, maxLon;
    minLat = minLon = Number.MAX_SAFE_INTEGER;
    maxLat = maxLon = Number.MIN_SAFE_INTEGER;

    waypoints.forEach(waypoint => {
      const [longitude, latitude] = waypoint;
      if (latitude < minLat) minLat = latitude;
      if (latitude > maxLat) maxLat = latitude;
      if (longitude < minLon) minLon = longitude;
      if (longitude > maxLon) maxLon = longitude;
    });

    return new BoundedBox([minLon, maxLat], [maxLon, minLat]);
  }
}

export default BoundedBox;