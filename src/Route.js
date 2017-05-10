import _ from 'underscore';
import Edge from './Edge';

export default class Route {
  constructor(a, b) {
    this.edges = [new Edge(a, b)];
    this.setValueAndDistanceAndWaypoints();
    this.hash = this.getHashCode();

    //this.distance = start.getDistanceToWaypoint(end);
    //this.waypoints = [start, end];
  }

  add(waypoint) {
    this.edges.push(new Edge(_.last(this.edges).b, waypoint));
    this.setValueAndDistanceAndWaypoints();
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
      distance += edge.haversineDistance;
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

  //
  // addWaypoint(waypoint) {
  //   this.value += waypoint.value;
  //   this.distance += _.last(this.waypoints).getDistanceToWaypoint(waypoint);
  //   this.waypoints.push(waypoint);
  //   this.hash = this.getHashCode();
  // }
  //
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