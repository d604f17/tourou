import _ from 'underscore';
import extend from 'extend';
import Edge from './Edge';

export default class Route {
  constructor(a, b) {
    if (a && b) {
      this.edges = [new Edge(a, b)];
      this.setValueAndDistanceAndWaypoints();
      this.hash = this.getHashCode();
    }

    //this.distance = start.getDistanceToWaypoint(end);
    //this.waypoints = [start, end];
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