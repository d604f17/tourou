console.log('--------------------------------------------------------');
import Waypoint from './Waypoint.js';
import Route from './Route.js';
import Edge from './Edge.js';
import Cache from './Cache.js';
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

highestValueFirst(waypoints, 2).then(data => {
  //console.log(data);

  waypoints.forEach(waypoint => {
    const route = new Route(waypoints[0], waypoint);
    if (route.distance > 0 && route.distance <= maxDistance) workingRoutes.add(route);
  });

  while (workingRoutes.length) {
    const workingRoute = workingRoutes.shift();
    waypoints.forEach(waypoint => {
      if (waypoint === waypoints[0]) {
        workingRoute.add(waypoint);
        console.log('possible', workingRoute);
        if (workingRoute.distance <= maxDistance)
          possibleRoutes.add(workingRoute);
      } else if (!workingRoute.containsWaypoint(waypoint)) {
        workingRoute.add(waypoint);
        // console.log('working', workingRoute);
        if (workingRoute.distance <= maxDistance)
          workingRoutes.add(workingRoute);
      }
    });

    // console.log(workingRoute.distance, maxDistance);
    // waypoints.forEach(waypoint => {
    //
    //   if (workingRoute.distance <= maxDistance) {
    //     if (waypoint === waypoints[0]) {
    //       workingRoute.add(waypoint);
    //       possibleRoutes.add(workingRoute);
    //     } else if (!workingRoute.containsWaypoint(waypoint)) {
    //       workingRoute.add(waypoint);
    //       workingRoutes.add(workingRoute);
    //     }
    //   }
    // });
  }

  // console.log(possibleRoutes);
})
;


