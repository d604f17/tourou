import directions from '../directions';

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
      }

      resolve({distance, box});
    });
  });
};
