'use strict';

var _mmas = require('./mmas');

var _mmas2 = _interopRequireDefault(_mmas);

var _directions = require('./directions');

var _directions2 = _interopRequireDefault(_directions);

var _diagonalization = require('./strategies/diagonalization');

var _diagonalization2 = _interopRequireDefault(_diagonalization);

var _attractions = require('./apis/attractions');

var _attractions2 = _interopRequireDefault(_attractions);

var _BoundedBox = require('./BoundedBox');

var _BoundedBox2 = _interopRequireDefault(_BoundedBox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var attractionAPI = new _attractions2.default({
  geocode: 'AIzaSyC6rAQ1c46pBfRcnQwSidnpGBeeumnhmjU',
  flickr: '85f11febb88e3a4d49342a95b7bcf1e8'
});

var cities = {
  'copenhagen': 'denmark/copenhagen'
};

var city = process.argv[process.argv.length - 2];
var maxDistance = process.argv[process.argv.length - 1];
var start = new Date().getTime();

if (city in cities) {
  attractionAPI.query(cities[city]).then(function (attractions) {
    var waypoints = attractions.map(function (attraction) {
      return [attraction['location']['lng'], attraction['location']['lat'], attraction['popularity']];
    });

    var boundexBox = _BoundedBox2.default.generateFromWaypoints(waypoints);

    var regression = function regression(x) {
      return Math.round(27.80137609 * Math.log(x) - 122.02143175);
    };

    console.log('running diagonalization');
    (0, _diagonalization2.default)(waypoints, regression(boundexBox.area)).then(function (boxes) {
      var route = (0, _mmas2.default)(waypoints, boxes, { maxDistance: maxDistance });

      var coordinates = route._tour.map(function (vertex) {
        return vertex.y + ',' + vertex.x;
      });

      console.log('fetching real distance');
      _directions2.default.query({
        mode: 'walking',
        origin: coordinates.shift(),
        destination: coordinates.pop(),
        waypoints: coordinates.join('|')
      }).then(function (result) {
        var legs = result.routes[0]['legs'];
        var distances = legs.map(function (leg) {
          return leg.distance.value;
        });
        route._heuristicDistance = route._distance;
        route._distance = distances.reduce(function (a, b) {
          return a + b;
        });
        route._distance += 2500 * (legs.length - 2);
        route._runtime = new Date().getTime() - start;
        delete route._graph;

        console.log(route);
      });
    });
  }).catch(console.error);
}
//# sourceMappingURL=main.js.map