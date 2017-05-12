const util = require('util');
console.log('--------------------------------------------------------');
import _ from 'underscore';
import Edge from './Edge.js';
import Route from './Route.js';
import Waypoint from './Waypoint.js';
import RouteCollection from './RouteCollection.js';
import {highestValueFirst} from './strategies';

const maxDistance = 99999999999;

const waypoints = [
  new Waypoint(56, 10, 10),
  new Waypoint(56.1, 10, 2),
  new Waypoint(56, 10.1, 4),
  new Waypoint(56, 10.5, 7),
  new Waypoint(56.1, 10.1, 9),
];

let route = new Route(waypoints[0], waypoints[3]);

route.edges.forEach(edge => {
  let f = route.calculateLinearEquation(edge.a, edge.b);
  console.log(edge.a.longitude, edge.b.longitude);
  for(let i = edge.a.longitude; i < edge.b.longitude; i++) {
    console.log(i);
  }
  console.log();
});