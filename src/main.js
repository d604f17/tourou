const util = require('util');
console.log('--------------------------------------------------------');
import Waypoint from './Waypoint.js';
import {diagonalization} from './strategies';
import orienteering from './orienteering';
import halfnhalf from './halfnhalf';

const attractions = require('./attractions/denmark-funen-odense.json');

const maxDistance = 10000;

console.time('runtime');
const waypoints = attractions.map(sight => new Waypoint(sight.lng, sight.lat, sight.popularity));
console.log(waypoints.length);
orienteering(0, maxDistance, waypoints, diagonalization).then(route => {
  // console.log(route);
  console.log(util.inspect(route, false, null));
  console.timeEnd('runtime');
}).catch(console.error);