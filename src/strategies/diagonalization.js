import {queryBoxDistance} from './strategy';
import BoundedBox from '../BoundedBox';
import directions from './../directions';

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

const asyncIterate = (list, callback) => {
  (function iterate(index) {

    callback({value: list[index], done: index == list.length - 1}, index, function() {
      if (index + 1 < list.length) iterate(++index);
    });
  })(0);
};

const diagonalization = (waypoints, iterations) => (
    new Promise((resolve) => {
      let count = 0;
      let boxes = [BoundedBox.generateFromWaypoints(waypoints)];

      while (count < iterations - 1) {
        boxes.push(...splitBoundedBox(boxes.shift()));
        count++;
      }

      const queries = boxes.map(box => {
        return {origin: `${box.n},${box.w}`, destination: `${box.s},${box.e}`};
      });

      directions.query(queries).then(directions => {
        const result = [];

        boxes.forEach((box, i) => {
          const route = directions[i].routes[0];

          if (route) {
            const distance = route['legs'][0]['distance']['value'];
            const difference = distance / box.haversineDistance;
            box.multiplier = parseFloat(difference.toFixed(3));
          } else {
            box.multiplier = 1;
          }

          result.push(box);
        });

        resolve(result);
      });
    })
);

export default diagonalization;