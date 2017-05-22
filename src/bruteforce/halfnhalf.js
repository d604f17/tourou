const util = require('util');
import _ from 'underscore';
import Route from './Route.js';
import RouteCollection from './RouteCollection.js';
import {one} from './strategies';
import orienteering from './orienteering';
import Directions from 'directions-api';

// const directions = new Directions('AIzaSyBw9WbNkrlLt4IXxpGzAAmQrRCn_PchFog');
const directions = new Directions('AIzaSyDoHGpEGGn6nwiyWXvhOvOSOoTLnWwE4TE');

const halfnhalf = (iterations, maxDistance, waypoints) => {
  return new Promise(resolve => {
    let count = 0;
    let bestRoute;
    let bestRouteDistance = Number.MIN_VALUE;

    (function loop(min, max) {
      if (count < iterations) {
        ++count;
        orienteering(0, max, waypoints, one).then(route => {
          let localMin = min, localMax = max;

          if (Math.round(min) === Math.round(max)) {
            count = iterations;
            bestRoute = route;
            bestRouteDistance = route.realDistance;
          } else if (route.realDistance > maxDistance) {
            localMax = min + (max - min) / 2;
          } else if (route.realDistance < maxDistance) {
            if (route.realDistance > bestRouteDistance) {
              bestRoute = route;
              bestRouteDistance = route.realDistance;
            }
            localMin = max;
            localMax = max + (max - min) / 2;
          } else {
            count = iterations;
            bestRoute = route;
            bestRouteDistance = route.realDistance;
          }
          loop(localMin, localMax);
        });
      } else {
        resolve(bestRoute);
      }
    })(0, maxDistance);
  });
};

export default halfnhalf;
