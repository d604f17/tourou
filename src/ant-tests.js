import fs from 'fs';
import mmas from './aco/mmas';
import {one} from './strategies';
import cities from '../attractions';

let attractions = {};

Object.keys(cities).map(city => {
  attractions[city] = cities[city].map(attraction => {
    return [attraction['lng'], attraction['lat'], attraction['popularity']];
  });
});

const log = (name, data, callback) => {
  fs.writeFile(__dirname + '/../logs/' + name + '.log', data, function(error) {
    if (error) console.error(error);
    callback();
  });
};

function asyncIterate(list, callback) {
  (function iterate(index) {
    callback(list[index], index, function() {
      if (index + 1 < list.length) iterate(++index);
    });
  })(0);
}

const antTest = (graphSize, iterations, colonySize) => {
  return function() {
    return new Promise((resolve, reject) => {
      const waypoints = attractions.sydney.slice(0, graphSize);
      one(waypoints).then(boxes => {
        const route = mmas(waypoints, boxes, {
          maxIterations: iterations,
          colonySize: colonySize,
        });

        const data = `${graphSize}, ${iterations}, ${colonySize}, ${route._value}, ${route._distance}\r\n`;

        fs.appendFile(__dirname + '/../logs/ant.tests.csv', data, function(error) {
          if (error) reject(error);
          else resolve(route);
        });
      });
    });
  };
};

let tests = [];
for (var graphSize = 10; graphSize <= 50; graphSize += 10) {
  for (var iterations = 10; iterations <= 100; iterations += 10) {
    for (var colonySize = 5; colonySize <= 30; colonySize += 5) {
      for (var i = 1; i <= 5; i++) {
        tests.push(antTest(graphSize, iterations, colonySize));
      }
    }
  }
}

let timeout = null;
asyncIterate(tests, function(test, index, next) {
  if (timeout == null) {
    console.log(tests.length - index + ' left');
    timeout = setTimeout(() => {
      timeout = null;
    }, 10000);
  }

  test().then(() => {
    next();
  });
});
