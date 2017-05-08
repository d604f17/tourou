import _ from 'underscore';

export default class Route {
  constructor(start, end) {
    this.value = start.value + end.value;
    this.distance = start.getDistanceToWaypoint(end);
    this.waypoints = [start, end];
  }

  getHashCode() {
    const waypoints = [...this.waypoints];
    const start = waypoints.shift();
    const end = waypoints.pop();

    let hash = `${start.id}:`;

    if(waypoints.length){
      waypoints.sort((a, b) => a.id - b.id);
      hash += waypoints.map(waypoint => waypoint.id).join(':') + ':';
    }

    return hash + `${end.id}`;
  }

  containsWaypoint(waypoint) {
    return _.contains(this.waypoints, waypoint);
  }

  addWaypoint(waypoint) {
    this.value += waypoint.value;
    this.distance += _.last(this.waypoints).getDistanceToWaypoint(waypoint);
    this.waypoints.push(waypoint);
  }
}