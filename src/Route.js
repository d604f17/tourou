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

  calcMultiplier(edge) {
    let sum = [];

    this.boundedBoxes.forEach(bound => {
      let edgeLatRange = [];
      let boundLatRange = [];

      if (edge.a.latitude > edge.b.latitude) {
        edgeLatRange[0] = edge.b.latitude;
        edgeLatRange[1] = edge.a.latitude;
      } else {
        edgeLatRange[0] = edge.a.latitude;
        edgeLatRange[1] = edge.b.latitude;
      }

      if (bound.nw[1] > bound.se[1]) {
        boundLatRange[0] = bound.se[1];
        boundLatRange[1] = bound.nw[1];
      } else {
        boundLatRange[0] = bound.nw[1];
        boundLatRange[1] = bound.se[1];
      }

      let check = (y) => {
        return edgeLatRange[0] <= y &&
            edgeLatRange[1] >= y &&
            boundLatRange[0] <= y &&
            boundLatRange[1] >= y;
      };

      const edgeAWithinBox = bound.nw[0] <= edge.a.latitude &&
          bound.nw[1] <= edge.a.longitude &&
          bound.se[0] >= edge.a.latitude &&
          bound.se[1] >= edge.a.longitude;

      const edgeBWithinBox = bound.nw[0] <= edge.b.latitude &&
          bound.nw[1] <= edge.b.longitude &&
          bound.se[0] >= edge.b.latitude &&
          bound.se[1] >= edge.b.longitude;

      if (edgeAWithinBox ||
          edgeBWithinBox ||
          check(edge.equSolveForY(bound.nw[0])) ||
          check(edge.equSolveForY(bound.se[0]))) {
        sum.push(bound.multiplier);
      }
    });

    if (sum.length)
      return edge.multiplier = sum.reduce((a, b) => a + b) / sum.length;
    else {
      return 1;
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

      distance += edge.haversineDistance * this.calcMultiplier(edge);
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

// calculateLinearEquation(a, b) {
//   const m = (b.latitude - a.latitude) / (b.longitude - a.longitude);
//
//   return function(x) {
//     return m * x - m * a.longitude + a.latitude;
//   };
// }

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