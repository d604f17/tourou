import util from 'util';
import fs from 'fs';
import haversine from 'haversine';
import BoundedBox from './strategies/BoundedBox';
import mmas from './aco/mmas';
import halfnhalf from './aco/halfnhalf';
import {one, diagonalization} from './strategies';
import cities from '../attractions';
import directions from './directions';

let attractions = {};
Object.keys(cities).map(city => {
  attractions[city] = cities[city].map(attraction => {
    return [attraction['lng'], attraction['lat'], attraction['popularity']];
  });
});

const log = (name, data, callback) => {
  fs.writeFileSync(__dirname + '/../logs/' + name + '.log', data);
  callback();
};

const test = (name, func) => {
  return function() {
    console.log(name, 'started');
    return new Promise(resolve => {
      func((data) => {
        resolve(data);
        log(name, data, () => {
          console.log(name, 'complete');
        });
      });
    });
  };
};

const asyncIterate = (list, callback) => {
  (function iterate(index) {
    callback(list[index], index, function() {
      if (index + 1 < list.length) iterate(++index);
    });
  })(0);
};

const getArea = (box) => {
  const verticalA = {longitude: box.e, latitude: box.n};
  const verticalB = {longitude: box.e, latitude: box.s};
  const horizontalA = {longitude: box.e, latitude: box.n};
  const horizontalB = {longitude: box.w, latitude: box.n};
  const vertical = haversine(verticalA, verticalB, {unit: 'meter'});
  const horizontal = haversine(horizontalA, horizontalB, {unit: 'meter'});
  return vertical * horizontal;
};

const oneTest = (city, waypoints, passes) => {
  let queries = [];

  for (var i = 1; i <= passes; i++) {
    queries.push(
        test(`ant-one_${city}_p${i}`, resolve => {
          var start = new Date().getTime();
          one(waypoints).then(boxes => {
            const route = mmas(waypoints, boxes);

            const coordinates = route._tour.map(vertex => {
              return vertex.y + ',' + vertex.x;
            });

            const area = getArea(
                BoundedBox.generateFromWaypoints(route._graph._vertices.map(v => [v.x, v.y])));

            directions.query({
              mode: 'walking',
              origin: coordinates.shift(),
              destination: coordinates.pop(),
              waypoints: coordinates.join('|'),
            }).then(result => {
              let legs = result.routes[0].legs;
              let distances = legs.map(leg => leg.distance.value);
              route._realDistance = distances.reduce((a, b) => a + b);
              route._realDistance += 2500 * (legs.length - 1);

              var end = new Date().getTime();
              const routeData = `${route.value}, ${route._distance}, ${route._realDistance}`;
              const inputData = `${waypoints.length}`;
              delete route['_graph'];
              resolve(
                  `${routeData}, ${inputData}, ${area}, ${end - start}, ${JSON.stringify(route)}`);
            });
          });
        }),
    );
  }

  return queries;
};

const diagonalizationTest = (city, waypoints, passes, iterations) => {
  let queries = [];

  for (var i = 1; i <= passes; i++) {
    queries.push(
        test(`ant-diag_${city}_i${iterations}_p${i}`, resolve => {
          var start = new Date().getTime();

          diagonalization(waypoints, iterations).then(boxes => {
            const route = mmas(waypoints, boxes);

            const coordinates = route._tour.map(vertex => {
              return vertex.y + ',' + vertex.x;
            });

            const area = getArea(
                BoundedBox.generateFromWaypoints(route._graph._vertices.map(v => [v.x, v.y])));
            directions.query({
              mode: 'walking',
              origin: coordinates.shift(),
              destination: coordinates.pop(),
              waypoints: coordinates.join('|'),
            }).then(result => {
              let legs = result.routes[0].legs;
              let distances = legs.map(leg => leg.distance.value);
              route._realDistance = distances.reduce((a, b) => a + b);
              route._realDistance += 2500 * (legs.length - 2);

              var end = new Date().getTime();
              const routeData = `${route.value}, ${route._distance}, ${route._realDistance}`;
              const inputData = `${waypoints.length}, ${iterations}`;
              delete route['_graph'];
              resolve(
                  `${routeData}, ${inputData}, ${area}, ${end - start}, ${JSON.stringify(route)}`);
            });
          });
        }),
    );
  }

  return queries;
};

const theHalfeningTest = (city, waypoints, passes, iterations) => {
  let queries = [];

  for (var i = 1; i <= passes; i++) {
    queries.push(
        test(`ant-half_${city}_i${iterations}_p${i}`, resolve => {
          var start = new Date().getTime();
          halfnhalf(iterations, 20000, waypoints).then(route => {
            var end = new Date().getTime();

            const area = getArea(
                BoundedBox.generateFromWaypoints(route._graph._vertices.map(v => [v.x, v.y])));

            const routeData = `${route.value}, ${route._distance}, ${route._realDistance}`;
            const inputData = `${waypoints.length}, ${iterations}`;

            delete route['_graph'];
            resolve(
                `${routeData}, ${inputData}, ${area}, ${end - start}, ${JSON.stringify(route)}`);
          });
        }),
    );
  }

  return queries;
};

const tests = [
    // tests to run.
    // differenc max distance.
    // compare unused cities.

  // ...oneTest('sydney', attractions.sydney, 1),

  // ...oneTest('newyorkcity', attractions.newYorkCity, 5),
  // ...diagonalizationTest('newyorkcity', attractions.newYorkCity, 5, 500),
  // ...theHalfeningTest('newyorkcity', attractions.newyorkcity, 5, 1),

  // ...oneTest('copenhagen', attractions.copenhagen, 10),
  // ...oneTest('madrid', attractions.madrid, 10),
  // ...oneTest('venice', attractions.venice, 10),
  // ...oneTest('newYorkCity', attractions.newYorkCity, 1),

  ...theHalfeningTest('compare-barcelona_m20k', attractions.barcelona, 5, 3),
  ...diagonalizationTest('compare-barcelona_m20k', attractions.barcelona, 5, 30),

  ...theHalfeningTest('compare-berlin_m20k', attractions.berlin, 5, 3),
  ...diagonalizationTest('compare-berlin_m20k', attractions.berlin, 5, 45),

  ...theHalfeningTest('compare-rio_m20k', attractions.rio, 5, 5),
  ...diagonalizationTest('compare-rio_m20k', attractions.rio, 5, 86),

  ...theHalfeningTest('compare-rome_m20k', attractions.rome, 5, 5),
  ...diagonalizationTest('compare-rome_m20k', attractions.rome, 5, 93),
];

asyncIterate(tests, function(test, index, next) {
  console.log(`${tests.length - index} tests left`);
  test().then(() => {
    next();
  }).catch(console.error)
});
