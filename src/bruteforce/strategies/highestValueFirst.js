import Directions from 'directions-api';
import Edge from '../Edge';

const directions = new Directions('AIzaSyBw9WbNkrlLt4IXxpGzAAmQrRCn_PchFog');

const orderByHighestValue = (waypoints) => {
  let clone = [...waypoints];
  clone.sort((a, b) => b.value - a.value);
  return clone;
};

const calculateBoundedBox = (waypoints) => {
  let minLat, minLon, maxLat, maxLon;
  minLat = minLon = Number.MAX_SAFE_INTEGER;
  maxLat = maxLon = Number.MIN_SAFE_INTEGER;

  waypoints.forEach(waypoint => {
    if (waypoint.latitude < minLat) minLat = waypoint.latitude;
    if (waypoint.latitude > maxLat) maxLat = waypoint.latitude;
    if (waypoint.longitude < minLon) minLon = waypoint.longitude;
    if (waypoint.longitude > maxLon) maxLon = waypoint.longitude;
  });

  return {
    nw: [minLon, minLat],
    se: [maxLon, maxLat],
  };
};

const queryDistance = (edge) => new Promise((resolve, reject) => {
  directions.query({
    mode: 'walking',
    origin: edge.a.latitude + ',' + edge.a.longitude,
    destination: edge.b.latitude + ',' + edge.b.longitude,
  }).then(result => {
    edge.walkingDistance = result.routes[0].legs[0].distance.value;
    resolve(edge);
  }).catch(reject);
});

const calculateDistance = (a, b) => {
  let result = a.walkingDistance / a.haversineDistance;
  if (b) result += b.walkingDistance / b.haversineDistance;
  return result;
};

const highestValueFirst = (waypoints, iterations) => {
  return new Promise((resolve) => {
    const highestValueWaypoints = orderByHighestValue(waypoints);

    let queries = [];

    for (let i = 0; i < iterations; i++) {
      const edge = new Edge(highestValueWaypoints[i], highestValueWaypoints[i + 1]);
      queries.push(queryDistance(edge));
    }

    Promise.all(queries).then(edges => {
      let sum = edges.length > 1 ? edges.reduce(calculateDistance) : calculateDistance(edges[0]);
      let average = sum / edges.length;

      resolve([
        {
          ...calculateBoundedBox(waypoints),
          multiplier: average,
        },
      ]);
    });
  });
};

export default highestValueFirst;