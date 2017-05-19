import _ from 'underscore';
import Route from './Route.js';
import RouteCollection from './RouteCollection.js';
import Directions from 'directions-api';

// const directions = new Directions('AIzaSyBw9WbNkrlLt4IXxpGzAAmQrRCn_PchFog');
const directions = new Directions('AIzaSyDoHGpEGGn6nwiyWXvhOvOSOoTLnWwE4TE');

const orienteering = (iterations, maxDistance, waypoints, strategy) => {
  return new Promise(resolve => {
    strategy(waypoints, iterations).then(boxes => {
      let workingRoutes = new RouteCollection();
      let possibleRoutes = new RouteCollection();

      for (let i = 1; i < waypoints.length; i++) {
        const route = new Route(waypoints[0], waypoints[i], boxes);

        if (route.distance > 0 && route.distance <= maxDistance)
          workingRoutes.push(route);
      }

      while (workingRoutes.length > 0) {
        const workingRoute = workingRoutes.shift();

        waypoints.forEach(waypoint => {
          const localWorkingRoute = workingRoute.clone();

          // check for index istedet for object match
          if (_.isEqual(waypoint, waypoints[0])) {
            localWorkingRoute.add(waypoint);

            if (localWorkingRoute.distance <= maxDistance)
              possibleRoutes.pushOrReplaceIfLowerDistance(localWorkingRoute);
          } else if (!localWorkingRoute.containsWaypoint(waypoint)) {
            localWorkingRoute.add(waypoint);

            if (localWorkingRoute.distance <= maxDistance)
              workingRoutes.pushOrReplaceIfLowerDistance(localWorkingRoute);
          }
        });
      }

      possibleRoutes.sort((a, b) => b.value - a.value);

      const route = possibleRoutes.first;

      const coordinates = route.waypoints.map(waypoint => {
        return `${waypoint.latitude},${waypoint.longitude}`;
      });

      directions.query({
        mode: 'walking',
        origin: coordinates.shift(),
        destination: coordinates.pop(),
        waypoints: coordinates.join('|'),
      }).then(result => {
        route.realDistance = result.routes[0].legs.reduce((a, b, index) => {
          if (index === 1) {
            return a.distance.value + b.distance.value;
          }

          return a + b.distance.value;
        });

        resolve(route);
      });
    });
  });
};

export default orienteering;