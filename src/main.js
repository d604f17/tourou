import Waypoint from './Waypoint.js';
import Route from './Route.js';
import RouteCollection from './RouteCollection.js';

console.log('--------------------------------------------------------');

const maxDistance = 30;

const waypoints = [
  new Waypoint(56, 10, 0),
  new Waypoint(56.1, 10, 2),
  new Waypoint(56, 10.1, 3),
  new Waypoint(56.1, 10.1, 4),
];

let route1 = new Route(waypoints[0], waypoints[1]);
route1.addWaypoint(waypoints[2]);
route1.addWaypoint(waypoints[3]);

console.log(route1.getHashCode());

let route2 = new Route(waypoints[0], waypoints[2]);
route2.addWaypoint(waypoints[1]);
route2.addWaypoint(waypoints[3]);

console.log(route2.getHashCode());

let routes = new RouteCollection([
  route1
]);

console.log(routes.containsRoute(route2));


// let workingRoutes = new RouteCollection();
// let possibleRoutes = new RouteCollection();
//
// waypoints.forEach(waypoint => {
//   const route = new Route(waypoints[0], waypoint);
//
//   if (route.distance) workingRoutes.push(route);
// });
//
// while (workingRoutes.length) {
//   const workingRoute = workingRoutes.shift();
//
//   waypoints.forEach(waypoint => {
//     if (workingRoute.distance <= maxDistance) {
//       if (waypoint === waypoints[0]) {
//         workingRoute.addWaypoint(waypoint);
//         possibleRoutes.push(workingRoute);
//       } else if (!workingRoute.containsWaypoint(waypoint)) {
//         workingRoute.addWaypoint(waypoint);
//         workingRoutes.push(workingRoute);
//       }
//     }
//   });
// }

