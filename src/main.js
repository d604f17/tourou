const util = require('util');
console.log('--------------------------------------------------------');
import _ from 'underscore';
import Route from './Route.js';
import Waypoint from './Waypoint.js';
import RouteCollection from './RouteCollection.js';
import {highestValueFirst, diagonalization} from './strategies';
import Directions from 'directions-api';

// const directions = new Directions('AIzaSyBw9WbNkrlLt4IXxpGzAAmQrRCn_PchFog');
const directions = new Directions('AIzaSyDoHGpEGGn6nwiyWXvhOvOSOoTLnWwE4TE');

const maxDistance = 7000;

const waypoints = [
  new Waypoint(12.563432, 55.675073, 0), // hotel sas cph
  new Waypoint(12.608115, 55.676042, 300), // christiania
  new Waypoint(12.568147, 55.673684, 500), // tivoli gardens
  new Waypoint(12.57573, 55.681347, 200), // rundetårn
  new Waypoint(12.574741, 55.674648, 100), // national museet
];

function orienteering(iterations, waypoints, strategy) {
  strategy(waypoints, iterations).then(boxes => {
    let workingRoutes = new RouteCollection();
    let possibleRoutes = new RouteCollection();

    for (let i = 1; i < waypoints.length; i++) {
      const route = new Route(waypoints[0], waypoints[i], boxes);

      if (route.distance > 0 && route.distance <= maxDistance)
        workingRoutes.add(route);
    }

    while (workingRoutes.length > 0) {
      const workingRoute = workingRoutes.shift();

      waypoints.forEach(waypoint => {
        const localWorkingRoute = workingRoute.clone();

        // check for index istedet for object match
        if (_.isEqual(waypoint, waypoints[0])) {
          localWorkingRoute.add(waypoint);

          if (localWorkingRoute.distance <= maxDistance)
            possibleRoutes.replaceIfBetter(localWorkingRoute);
        } else if (!localWorkingRoute.containsWaypoint(waypoint)) {
          localWorkingRoute.add(waypoint);

          if (localWorkingRoute.distance <= maxDistance)
            workingRoutes.replaceIfBetter(localWorkingRoute);
        }
      });
    }

    possibleRoutes.sort((a, b) => b.value - a.value);

    const route = possibleRoutes.first;

    const coordinates = route.waypoints.map(waypoint => {
      return `${waypoint.latitude},${waypoint.longitude}`;
    });

    // console.log(route.waypoints);

    directions.query({
      mode: 'walking',
      origin: coordinates.shift(),
      destination: coordinates.pop(),
      waypoints: coordinates.join('|'),
    }).then(result => {

      // result.routes[0].legs.forEach(leg => {
      //   delete leg.steps;
      //   // console.log(leg);
      //
      // });

      if(!result.routes.length) console.log(result);
      const totalDistance = result.routes[0].legs.reduce((a, b, index) => {
        if (index === 1) {
          return a.distance.value + b.distance.value;
        }

        return a + b.distance.value;
      });

      console.log(route.distance, totalDistance);

      // console.log(result.routes[0].waypoint_order);

      // console.log(util.inspect(result.routes, false, null));
    });
  }).catch(console.error);
}

orienteering(1, waypoints, diagonalization);

