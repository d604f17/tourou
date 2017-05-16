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
        edge,
        distance: result.routes[0].legs[0].distance.value,
      });
    }).catch(reject);
  });
};

export const queryBoxDistance = (box) => {
  return new Promise((resolve, reject) => {
    directions.query({
      mode: 'walking',
      origin: box.n + ',' + box.w,
      destination: box.s + ',' + box.e,
    }).then(result => {
      console.log(result);
      let distance = result.routes.length > 0 ? result.routes[0].legs[0].distance.value : null;
      resolve({box, distance: distance});
    });
  });
};
