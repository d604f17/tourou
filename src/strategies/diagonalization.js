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

const asyncIterate = (list, callback) => {
  (function iterate(index) {

    callback({value: list[index], done: index == list.length - 1}, index, function() {
      if (index + 1 < list.length) iterate(++index);
    });
  })(0);
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

      queries = boxes.map(function(box) {
        return function() {
          return queryBoxDistance(box);
        };
      });

      let nodes = [];
      asyncIterate(queries, function(data, index, next) {
        data.value().then(node => {
          nodes.push(node);

          next();

          if (data.done) {
            resolve(nodes.map(node => {
              let difference;
              let {box} = node;

              if (node.distance > 0) {
                difference = node.distance / box.haversineDistance;
                box.multiplier = parseFloat(difference.toFixed(3));
              } else {
                box.multiplier = 1;
              }

              return box;
            }));
          }
        });
      });

      // Promise.all(queries).then(data => {
      //   resolve(data.map(node => {
      //     let difference;
      //     let {box} = node;
      //
      //     if (node.distance > 0) {
      //       difference = node.distance / box.haversineDistance;
      //       box.multiplier = parseFloat(difference.toFixed(3));
      //     } else {
      //       box.multiplier = 1;
      //     }
      //
      //     return box;
      //   }));
      // });
    })
);

export default diagonalization;