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
              route._realDistance += 2500 * (legs.length - 2);

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
          halfnhalf(iterations, 30000, waypoints).then(route => {
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
  // ...oneTest('newyorkcity', attractions.newYorkCity, 5),
  // ...diagonalizationTest('newyorkcity', attractions.newYorkCity, 5, 500),
  // ...theHalfeningTest('newyorkcity', attractions.newyorkcity, 5, 1),

  ...oneTest('aalborg', attractions.aalborg, 5),
  ...oneTest('johannesburg', attractions.johannesburg, 5),
  ...oneTest('madrid', attractions.madrid, 5),
  ...oneTest('copenhagen', attractions.copenhagen, 5),
  ...oneTest('lasVegas', attractions.lasVegas, 5),
  ...oneTest('losAngeles', attractions.losAngeles, 5),
  ...oneTest('cairo', attractions.cairo, 5),
  ...oneTest('newYorkCity', attractions.newYorkCity, 5),
  ...oneTest('venice', attractions.venice, 5),
];

asyncIterate(tests, function(test, index, next) {
  console.log(`${tests.length - index} tests left`);
  test().then(() => {
    next();
  });
});
