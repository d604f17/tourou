const util = require('util');
console.log('--------------------------------------------------------');
import Waypoint from './Waypoint.js';
import {diagonalization} from './strategies';
import Attractions from 'attractions-api';

import orienteering from './orienteering';
import halfnhalf from './halfnhalf';

const attractions = new Attractions({
  flickr: '85f11febb88e3a4d49342a95b7bcf1e8',
  geocode: 'AIzaSyDfZBp51fjQZwk4QogCZIUtRaz8z96G0Ks',
}, 10);

const maxDistance = 7000;
//
// const waypoints = [
//   new Waypoint(12.563432, 55.675073, 0), // hotel sas cph
//   new Waypoint(12.608115, 55.676042, 300), // christiania
//   new Waypoint(12.568147, 55.673684, 500), // tivoli gardens
//   new Waypoint(12.57573, 55.681347, 200), // rundetårn
//   new Waypoint(12.574741, 55.674648, 100), // national museet
// ];

attractions.query('denmark/copenhagen').then(sights => {
  const waypoints = sights.map(sight => new Waypoint(sight.lng, sight.lat, sight.popularity));

  // return orienteering(2, maxDistance, waypoints, diagonalization);
  return halfnhalf(5, maxDistance, waypoints);
}).then(route => {
  // console.log(route);
  console.log(util.inspect(route, false, null));
}).catch(console.error);



