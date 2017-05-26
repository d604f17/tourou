import BoundedBox from './BoundedBox';

const one = waypoints => (
    new Promise((resolve) => {
      let box = BoundedBox.generateFromWaypoints(waypoints);
      box.multiplier = 1;
      resolve([box]);
    })
);

export default one;