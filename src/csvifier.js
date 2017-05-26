import fs from 'fs';

const readValues = (type, name) => {
  let values = {};
  let data = fs.readFileSync(__dirname + '/../logs/' + name + '.log', 'utf8');

  let diagKeys = [
    'value',
    'distance',
    'realDistance',
    'numberOfWaypoints',
    'iterations',
    'area',
    'runtime',
    'route',
  ];

  let oneKeys = [
    'value',
    'distance',
    'realDistance',
    'numberOfWaypoints',
    'area',
    'runtime',
    'route',
  ];

  if (type === 'diag' || type === 'half') {
    for (var i = 0; i < 7; i++) {
      let value = data.substring(0, data.indexOf(','));
      data = data.substring(data.indexOf(',') + 2, data.length);

      values[diagKeys[i]] = value;
    }

    values[diagKeys[7]] = JSON.parse(data);
  } else if (type === 'one') {
    for (var i = 0; i < 6; i++) {
      let value = data.substring(0, data.indexOf(','));
      data = data.substring(data.indexOf(',') + 2, data.length);

      values[oneKeys[i]] = value;
    }

    values[oneKeys[6]] = JSON.parse(data);
  }

  return values;
};

const writeValues = (type, name, values) => {
  if (type === 'diag' || type === 'half') {
    const routeData = `${values.value}, ${values.distance}, ${values.realDistance}`;
    const inputData = `${values.numberOfWaypoints}, ${values.iterations}`;
    var data = `${routeData}, ${inputData}, ${values.area}, ${values.runtime}, ${JSON.stringify(
        values.route)}`;

    fs.writeFileSync(__dirname + '/../logs/' + name + '.log', data);
  } else if (type === 'one') {
    const routeData = `${values.value}, ${values.distance}, ${values.realDistance}`;
    const inputData = `${values.numberOfWaypoints}`;
    var data = `${routeData}, ${inputData}, ${values.area}, ${values.runtime}, ${JSON.stringify(
        values.route)}`;

    fs.writeFileSync(__dirname + '/../logs/' + name + '.log', data);
  }
};

let fileName = 'copenhagen';
let rows = [];
fs.readdirSync(__dirname + '/../logs/').forEach(file => {
  const [name, cityIP] = file.split('_');
  const [test, type] = name.split('-');
  if (type === 'diag') {
    const [city, iterations, passes] = cityIP.split('-');

    if (city === fileName) {
      let values = readValues(type, file.split('.').shift());

      let rowPart1 = `${values.value};${values.distance};${values.realDistance}`;
      let rowPart2 = `${values.numberOfWaypoints};${values.iterations};${values.area}`;
      let rowPart3 = `${values.runtime};${values.route._tour.length}`;

      rows.push(`${rowPart1};${rowPart2};${rowPart3}`);
    }
  }
});

fs.writeFileSync(__dirname + '/../logs/diag-' + fileName + '.csv', rows.join('\r\n'));

// fs.readdirSync(__dirname + '/../logs/').forEach(file => {
//   const [name, city] = file.split('_');
//   const [test, type] = name.split('-');
//
//   if (type === 'one' || type === 'diag') {
//     let values = readValues(type, file.split('.').shift());
//     values.realDistance = values.route._realDistance + 2500 * (values.route._tour.length - 2);
//     values.distance = values.route._distance - 2500;
//     delete values.route._graph;
//
//     console.log(file);
//
//     writeValues(type, file.split('.').shift(), values);
//   }
// });