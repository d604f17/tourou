import _ from 'underscore';
import extend from 'extend';
import Edge from './Edge';

export default class Route {
  constructor(a, b, boundedBoxes) {
    if (a && b) {
      this.edges = [new Edge(a, b)];
      this.boundedBoxes = boundedBoxes;
      this.setValueAndDistanceAndWaypoints();
      this.hash = this.getHashCode();
    }
  }

  add(waypoint) {
    this.edges.push(new Edge(_.last(this.edges).b, waypoint));
    this.setValueAndDistanceAndWaypoints();
    this.hash = this.getHashCode();
  }

  clone() {
    return extend(true, new Route(), this);
  }

  containsWaypoint(waypoint) {
    return _.contains(this.waypoints, waypoint);
  }

  setValueAndDistanceAndWaypoints() {
    let value = 0;
    let distance = 0;
    let waypoints = [];

    this.edges.forEach((edge, index) => {
      value += edge.a.value;
      distance += edge.haversineDistance * this.calculateMultiplier(edge);
      waypoints.push(edge.a);

      if (index === this.edges.length - 1) {
        value += edge.b.value;
        waypoints.push(edge.b);
      }
    });

    this.value = value;
    this.distance = distance;
    this.waypoints = waypoints;
  }

  calculateMultiplier(edge) {
    let sum = [];
    let edgeLatitudeRange = [edge.a.latitude, edge.b.latitude];

    edgeLatitudeRange.sort((a, b) => a - b);

    let errors = [];

    this.boundedBoxes.forEach(box => {
      let boundLatitudeRange = [box.n, box.s];

      boundLatitudeRange.sort((a, b) => a - b);

      const isYWithinEdgeAndBox = (y) => (
          edgeLatitudeRange[0] <= y &&
          edgeLatitudeRange[1] >= y &&
          boundLatitudeRange[0] <= y &&
          boundLatitudeRange[1] >= y
      );

      const isEdgeAWithinBox = edge.a.longitude >= box.w &&
          edge.a.longitude <= box.e &&
          edge.a.latitude >= box.s &&
          edge.a.latitude <= box.n;

      const isEdgeBWithinBox = edge.b.longitude >= box.w &&
          edge.b.longitude <= box.e &&
          edge.b.latitude >= box.s &&
          edge.b.latitude <= box.n;

      const hasEdgePassed = isEdgeAWithinBox ||
          isEdgeBWithinBox ||
          isYWithinEdgeAndBox(edge.linearEquation(box.w)) ||
          isYWithinEdgeAndBox(edge.linearEquation(box.e));

      if (hasEdgePassed) {
        sum.push(box.multiplier);
      }
    });

    if (sum.length) {
      return edge.multiplier = sum.reduce((a, b) => a + b) / sum.length;
    }
    else {
      return edge.multiplier = 1;
    }
  }

  getHashCode() {
    const waypoints = [...this.waypoints];
    const start = waypoints.shift();
    const end = waypoints.pop();

    let hash = `${start.id}:`;

    if (waypoints.length) {
      waypoints.sort((a, b) => a.id - b.id);
      hash += waypoints.map(waypoint => waypoint.id).join(':') + ':';
    }

    return hash + `${end.id}`;
  }
}