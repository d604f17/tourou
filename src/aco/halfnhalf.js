const util = require('util');

import {one} from '../strategies/index';
import mmas from './mmas';
import directions from '../directions';

const halfnhalf = (iterations, maxDistance, waypoints) => {
  return new Promise(resolve => {
    let count = 0;
    let bestRoute;
    let bestRouteDistance = Number.MIN_SAFE_INTEGER;

    (function loop(min, max) {
      if (count < iterations) {
        ++count;

        one(waypoints).then(boxes => {
          const route = mmas(waypoints, boxes, {maxDistance});

          const coordinates = route._tour.map(vertex => {
            return vertex.y + ',' + vertex.x;
          });

          directions.query({
            mode: 'walking',
            origin: coordinates.shift(),
            destination: coordinates.pop(),
            waypoints: coordinates.join('|'),
          }).then(result => {
            let legs = result.routes[0].legs;
            let distances = legs.map(leg => leg.distance.value);
            route._realDistance = distances.reduce((a, b) => a + b);
            route._realDistance += 2500 * (legs.length - 2);

            let localMin = min, localMax = max;

            if (Math.round(min) === Math.round(max)) {
              count = iterations;
              bestRoute = route;
              bestRouteDistance = route._realDistance;
            } else if (route._realDistance > maxDistance) {
              localMax = min + (max - min) / 2;
            } else if (route._realDistance < maxDistance) {
              if (route._realDistance > bestRouteDistance) {
                bestRoute = route;
                bestRouteDistance = route._realDistance;
              }
              localMin = max;
              localMax = max + (max - min) / 2;
            } else {
              count = iterations;
              bestRoute = route;
              bestRouteDistance = route._realDistance;
            }
            loop(localMin, localMax);
          });
        }).catch(console.error);
      } else {
        resolve(bestRoute);
      }
    })(0, maxDistance);
  });
};

export default halfnhalf;
