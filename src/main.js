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

function mangelPaaBedreNavn(iterations, waypoints, strategy) {
  strategy(waypoints, iterations).then(data => {
    let workingRoutes = new RouteCollection();
    let possibleRoutes = new RouteCollection();

    for (let i = 0; i < waypoints.length; i++) {
      const route = new Route(waypoints[0], waypoints[i]);

      if (route.distance > 0 && route.distance <= maxDistance)
        workingRoutes.add(route);
    }

    while (workingRoutes.length) {
      const workingRoute = workingRoutes.shift().clone();

      waypoints.forEach(waypoint => {
        const localWorkingRoute = workingRoute.clone();

        if (_.isEqual(waypoint, waypoints[0])) {
          localWorkingRoute.add(waypoint);
          if (localWorkingRoute.distance <= maxDistance &&
              !possibleRoutes.contains(localWorkingRoute))



            possibleRoutes.add(localWorkingRoute);
        } else if (!localWorkingRoute.containsWaypoint(waypoint)) {
          localWorkingRoute.add(waypoint);
          if (localWorkingRoute.distance <= maxDistance &&
              !workingRoutes.contains(localWorkingRoute))
            workingRoutes.add(localWorkingRoute);
        }
      });
    }

    console.log(util.inspect(possibleRoutes, false, null));
    console.log(data);
  });
}

mangelPaaBedreNavn(1, waypoints, highestValueFirst);