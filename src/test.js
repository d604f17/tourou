const util = require('util');
console.log('--------------------------------------------------------');
import Waypoint from './Waypoint';
import BoundedBox from './BoundedBox';
import Edge from './Edge';
import {one, diagonalization} from './strategies';
import orienteering from './orienteering';
import halfnhalf from './halfnhalf';

const iterations = 0;
const maxDistance = 30000;
const country = process.argv.pop();
const attractions = require('./attractions/' + country);

const getArea = (box) => {
  const vertical = new Edge({longitude: box.e, latitude: box.n},
      {longitude: box.e, latitude: box.s});
  const horizontal = new Edge({longitude: box.e, latitude: box.n},
      {longitude: box.w, latitude: box.n});

  return vertical.haversineDistance * horizontal.haversineDistance;
};

var start = new Date().getTime();
const waypoints = attractions.map(sight => new Waypoint(sight.lng, sight.lat, sight.popularity));
orienteering(iterations, maxDistance, waypoints, one).then(route => {
  var end = new Date().getTime();

  const area = getArea(BoundedBox.generateFromWaypoints(route.waypoints));
  console.log(route.hash, 'one', route.value, country, waypoints.length, area,
      iterations, route.distance, route.realDistance, maxDistance, end - start, JSON.stringify(route));
}).catch(console.error);