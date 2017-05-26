'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var readValues = function readValues(type, name) {
  var values = {};
  var data = _fs2.default.readFileSync(__dirname + '/../logs/' + name + '.log', 'utf8');

  var diagKeys = ['value', 'distance', 'realDistance', 'numberOfWaypoints', 'iterations', 'area', 'runtime', 'route'];

  var oneKeys = ['value', 'distance', 'realDistance', 'numberOfWaypoints', 'area', 'runtime', 'route'];

  if (type === 'diag' || type === 'half') {
    for (var i = 0; i < 7; i++) {
      var value = data.substring(0, data.indexOf(','));
      data = data.substring(data.indexOf(',') + 2, data.length);

      values[diagKeys[i]] = value;
    }

    values[diagKeys[7]] = JSON.parse(data);
  } else if (type === 'one') {
    for (var i = 0; i < 6; i++) {
      var _value = data.substring(0, data.indexOf(','));
      data = data.substring(data.indexOf(',') + 2, data.length);

      values[oneKeys[i]] = _value;
    }

    values[oneKeys[6]] = JSON.parse(data);
  }

  return values;
};

var writeValues = function writeValues(type, name, values) {
  if (type === 'diag' || type === 'half') {
    var routeData = values.value + ', ' + values.distance + ', ' + values.realDistance;
    var inputData = values.numberOfWaypoints + ', ' + values.iterations;
    var data = routeData + ', ' + inputData + ', ' + values.area + ', ' + values.runtime + ', ' + JSON.stringify(values.route);

    _fs2.default.writeFileSync(__dirname + '/../logs/' + name + '.log', data);
  } else if (type === 'one') {
    var _routeData = values.value + ', ' + values.distance + ', ' + values.realDistance;
    var _inputData = '' + values.numberOfWaypoints;
    var data = _routeData + ', ' + _inputData + ', ' + values.area + ', ' + values.runtime + ', ' + JSON.stringify(values.route);

    _fs2.default.writeFileSync(__dirname + '/../logs/' + name + '.log', data);
  }
};

var fileName = 'copenhagen';
var rows = [];
_fs2.default.readdirSync(__dirname + '/../logs/').forEach(function (file) {
  var _file$split = file.split('_'),
      _file$split2 = _slicedToArray(_file$split, 2),
      name = _file$split2[0],
      cityIP = _file$split2[1];

  var _name$split = name.split('-'),
      _name$split2 = _slicedToArray(_name$split, 2),
      test = _name$split2[0],
      type = _name$split2[1];

  if (type === 'diag') {
    var _cityIP$split = cityIP.split('-'),
        _cityIP$split2 = _slicedToArray(_cityIP$split, 3),
        city = _cityIP$split2[0],
        iterations = _cityIP$split2[1],
        passes = _cityIP$split2[2];

    if (city === fileName) {
      var values = readValues(type, file.split('.').shift());

      var rowPart1 = values.value + ';' + values.distance + ';' + values.realDistance;
      var rowPart2 = values.numberOfWaypoints + ';' + values.iterations + ';' + values.area;
      var rowPart3 = values.runtime + ';' + values.route._tour.length;

      rows.push(rowPart1 + ';' + rowPart2 + ';' + rowPart3);
    }
  }
});

_fs2.default.writeFileSync(__dirname + '/../logs/diag-' + fileName + '.csv', rows.join('\r\n'));

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
//# sourceMappingURL=csvifier.js.map