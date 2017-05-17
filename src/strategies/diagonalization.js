import {queryBoxDistance} from './strategy';
import BoundedBox from '../BoundedBox';

const splitBoundedBox = (box) => {
  const width = Math.abs(box.w - box.e);
  const height = Math.abs(box.n - box.s);

  if (width >= height) {
    return [
      new BoundedBox([box.w, box.n], [box.w + width / 2, box.s]),
      new BoundedBox([box.w + width / 2, box.n], [box.e, box.s]),
    ];
  } else {
    return [
      new BoundedBox([box.w, box.n], [box.e, box.s + height / 2]),
      new BoundedBox([box.w, box.s + height / 2], [box.e, box.s]),
    ];
  }
};

const diagonalization = (waypoints, iterations) => (
    new Promise((resolve) => {
      let queries;
      let count = 0;
      let boxes = [BoundedBox.generateFromWaypoints(waypoints)];

      while (count < iterations - 1) {
        boxes.push(...splitBoundedBox(boxes.shift()));
        count++;
      }

      queries = boxes.map(queryBoxDistance);

      Promise.all(queries).then(data => {
        resolve(data.map(node => {
          let difference;
          let {box} = node;

          if (node.distance > 0) {
            difference = node.distance / box.edge.haversineDistance;
            box.multiplier = parseFloat(difference.toFixed(3));
          } else {
            box.multiplier = 1;
          }

          return box;
        }));
      });
    })
);

export default diagonalization;