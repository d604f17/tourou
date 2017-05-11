const util = require('util');

import _ from 'underscore';

console.log('--------------------------------------------------------');
import Waypoint from './Waypoint.js';
import Route from './Route.js';
import Edge from './Edge.js';
import RouteCollection from './RouteCollection.js';
import {highestValueFirst} from './strategies';

const maxDistance = 30000;

const waypoints = [
  new Waypoint(56, 10, 10),
  new Waypoint(56.1, 10, 2),
  new Waypoint(56, 10.1, 4),
  new Waypoint(56, 10.5, 7),
  new Waypoint(56.1, 10.1, 9),
];

let workingRoutes = new RouteCollection();
let possibleRoutes = new RouteCollection();

for (let i = 0; i < waypoints.length; i++) {
  const route = new Route(waypoints[0], waypoints[i]);

  if (route.distance > 0 && route.distance <= maxDistance)
    workingRoutes.add(route);
}

//console.log(util.inspect(workingRoutes, false, null));

const workingRoute = workingRoutes.shift();
// console.log(workingRoute);
// console.log('llllllllllllllllllllllllllllllllllllllllll');
for (let i = 0; i < waypoints.length - 2; i++) {
  const localWorkingRoute = workingRoute.clone();
  const waypoint = waypoints[i];



  if (_.isEqual(waypoint, waypoints[0])) {
    console.log('if');
  //   //console.log('overview', waypoint, workingRoute);
    localWorkingRoute.add(waypoint);
  //   //console.log('working route', workingRoute);
  //   //console.log('possibleRoutes', util.inspect(possibleRoutes, false, null));
  //   //possibleRoutes.add(localWorkingRoute);
  //   //console.log('possibleRoutes', util.inspect(possibleRoutes, false, null));
  //   //console.log('::::::::::::::::::::::::::::::::::::::::::::::::::::::');
  } else if(!localWorkingRoute.containsWaypoint(waypoint)) {
    console.log('else');
    localWorkingRoute.add(waypoint);
  //   //workingRoutes.add(localWorkingRoute);
  }
  //
  console.log(i);
  console.log('working', workingRoute);
  console.log('local', localWorkingRoute);
}

// Route {
//   edges: [ Edge { a: [Object], b: [Object], haversineDistance: 11119 } ],
//       value: 12,
//       distance: 11119,
//       waypoints:
//   [ Waypoint { id: 1, latitude: 56, longitude: 10, value: 10 },
//     Waypoint { id: 2, latitude: 56.1, longitude: 10, value: 2 } ] }

// highestValueFirst(waypoints, 2).then(data => {
//   //console.log(data);
//
//   waypoints.forEach(waypoint => {
//     const route = new Route(waypoints[0], waypoint);
//     if (route.distance > 0 && route.distance <= maxDistance) workingRoutes.add(route);
//   });
//
//   while (workingRoutes.length) {
//     console.log(workingRoutes.length);
//     const workingRoute = workingRoutes.shift();
//     console.log(workingRoutes.length);
//     waypoints.forEach(waypoint => {
//       if (waypoint === waypoints[0]) {
//         workingRoute.add(waypoint);
//         console.log('possible', workingRoute);
//         if (workingRoute.distance <= maxDistance)
//           possibleRoutes.add(workingRoute);
//       } else if (!workingRoute.containsWaypoint(waypoint)) {
//         workingRoute.add(waypoint);
//         // console.log('working', workingRoute);
//         if (workingRoute.distance <= maxDistance)
//           workingRoutes.add(workingRoute);
//       }
//     });
//   }
// });






