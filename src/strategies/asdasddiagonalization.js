import Directions from 'directions-api';
import Waypoint from './../Waypoint.js';
import Edge from './../Edge.js';

const directions = new Directions('AIzaSyBw9WbNkrlLt4IXxpGzAAmQrRCn_PchFog');

const calculateBoundedBox = (waypoints) => {
  let minLat, minLon, maxLat, maxLon;
  minLat = minLon = Number.MAX_VALUE;
  maxLat = maxLon = Number.MIN_VALUE;

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

const splitBoundedBox = (box) => {
  const width = Math.abs(box.nw[0] - box.se[0]);
  const height = Math.abs(box.nw[1] - box.se[1]);

  if (width >= height) {
    return [
      {nw: [box.nw[0], box.nw[1]], se: [box.nw[0] + width / 2, box.se[1]]},
      {nw: [box.nw[0] + width / 2, box.nw[1]], se: [box.se[0], box.se[1]]},
    ];
  } else {
    return [
      {nw: [box.nw[0], box.nw[1]], se: [box.se[0], box.se[1] + height / 2]},
      {nw: [box.nw[0], box.se[1] + height / 2], se: [box.se[0], box.se[1]]},
    ];
  }
};

const boxToEdge = (box) => {
  return new Edge({latitude: box.nw[1], longitude: box.nw[0]},
      {latitude: box.se[1], longitude: box.se[0]});
};

const queryDistance = (edge, box) => new Promise((resolve, reject) => {
  directions.query({
    mode: 'walking',
    origin: edge.a.latitude + ',' + edge.a.longitude,
    destination: edge.b.latitude + ',' + edge.b.longitude,
  }).then(result => {
    edge.walkingDistance = result.routes[0].legs[0].distance.value;
    edge.box = box;
    resolve(edge);
  }).catch(reject);
});

const andreasFindPaaEtNavn = (waypoints, iterations) => {
  return new Promise((resolve) => {
    let count = 0;
    let queries = [];
    let boxes = [calculateBoundedBox(waypoints)];

    while (count < iterations - 1) {
      let box = splitBoundedBox(boxes.shift());
      boxes.push(...box);
      count++;
    }

    boxes.forEach(box => {
      queries.push(queryDistance(boxToEdge(box), box));
    });

    Promise.all(queries).then(edges => {
      resolve(edges.map(edge => {
        return {
          ...edge.box,
          multiplier: edge.walkingDistance / edge.haversineDistance,
        };
      }));
    });

    // resolve(boxes);
  });
};

export default andreasFindPaaEtNavn;