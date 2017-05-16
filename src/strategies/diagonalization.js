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
          let {box} = node;
          box.multiplier = parseFloat((node.distance / box.edge.haversineDistance).toFixed(3));
          return box;
        }));
      });
    })
);

export default diagonalization;