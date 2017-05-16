const util = require('util');
console.log('--------------------------------------------------------');
import _ from 'underscore';
import Route from './Route.js';
import Waypoint from './Waypoint.js';
import RouteCollection from './RouteCollection.js';
import {highestValueFirst, andreasFindPaaEtNavn, diagonalization} from './strategies';
import Directions from 'directions-api';

const directions = new Directions('AIzaSyBw9WbNkrlLt4IXxpGzAAmQrRCn_PchFog');

const maxDistance = 900000;

const waypoints = [
  new Waypoint(10, 56, 10),
  new Waypoint(10.1, 56.4, 2),
  new Waypoint(10.2, 56.3, 4),
  new Waypoint(10.3, 56.2, 7),
  new Waypoint(10.4, 56.1, 9),
];

function orienteering(iterations, waypoints, strategy) {
  strategy(waypoints, iterations).then(boxes => {
    console.log(boxes);
    // console.log(data);
    // let workingRoutes = new RouteCollection();
    // let possibleRoutes = new RouteCollection();
    //
    // for (let i = 1; i < waypoints.length; i++) {
    //   const route = new Route(waypoints[0], waypoints[i], data);
    //
    //   if (route.distance > 0 && route.distance <= maxDistance)
    //     workingRoutes.add(route);
    // }
    //
    // while (workingRoutes.length) {
    //   const workingRoute = workingRoutes.shift().clone();
    //
    //   waypoints.forEach(waypoint => {
    //     const localWorkingRoute = workingRoute.clone();
    //
    //     if (_.isEqual(waypoint, waypoints[0])) {
    //       localWorkingRoute.add(waypoint);
    //
    //       if (localWorkingRoute.distance <= maxDistance &&
    //           !possibleRoutes.contains(localWorkingRoute))
    //         possibleRoutes.add(localWorkingRoute);
    //     } else if (!localWorkingRoute.containsWaypoint(waypoint)) {
    //       localWorkingRoute.add(waypoint);
    //
    //       if (localWorkingRoute.distance <= maxDistance &&
    //           !workingRoutes.contains(localWorkingRoute))
    //         workingRoutes.add(localWorkingRoute);
    //     }
    //   });
    // }
    //
    // possibleRoutes.sort((a, b) => b.value - a.value);
    //
    // const route = possibleRoutes.get(0);
    //
    // const asmdk = route.waypoints.map(waypoint => {
    //   return `${waypoint.latitude},${waypoint.longitude}`;
    // });
    //
    // directions.query({
    //   mode: 'walking',
    //   origin: asmdk.shift(),
    //   destination: asmdk.pop(),
    //   waypoints: asmdk.join('|'),
    // }).then(result => {
    //   const totalDistance = result.routes[0].legs.reduce((a, b, index) => {
    //     if (index === 1) {
    //       return a.distance.value + b.distance.value;
    //     }
    //
    //     return a + b.distance.value;
    //   });
    //
    //   console.log(route.distance, totalDistance);
    // });

  }).catch(console.error);
}

// mangelPaaBedreNavn(1, waypoints, highestValueFirst);
// mangelPaaBedreNavn(4, waypoints, diagonalization);

orienteering(4, waypoints, diagonalization);

