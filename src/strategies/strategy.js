import Directions from 'directions-api';
const directions = new Directions('AIzaSyBw9WbNkrlLt4IXxpGzAAmQrRCn_PchFog');

export const queryEdgeDistance = (edge) => {
  return new Promise((resolve, reject) => {
    directions.query({
      mode: 'walking',
      origin: edge.a.latitude + ',' + edge.a.longitude,
      destination: edge.b.latitude + ',' + edge.b.longitude,
    }).then(result => {
      resolve({
        distance: result.routes[0].legs[0].distance.value,
        edge
      });
    })
  });
};

export const queryBoxDistance = (box) => {
  return new Promise((resolve) => {
    directions.query({
      mode: 'walking',
      origin: box.n + ',' + box.w,
      destination: box.s + ',' + box.e,
    }).then(result => {
      let distance = 0;
      const route = result.routes[0];

      if (route) {
        const leg = route.legs[0];
        distance = leg.distance.value;
        box.nw = [leg.start_location.lng, leg.start_location.lat];
        box.se = [leg.end_location.lng, leg.end_location.lat];
      }

      resolve({distance, box});
    });
  });
};
