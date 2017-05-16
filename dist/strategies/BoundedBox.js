'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Edge = require('./../Edge.js');

var _Edge2 = _interopRequireDefault(_Edge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BoundedBox = function () {
  function BoundedBox(nw, se) {
    _classCallCheck(this, BoundedBox);

    this.nw = nw;
    this.se = se;
  }

  _createClass(BoundedBox, [{
    key: 'n',
    get: function get() {
      return this.nw[1];
    }
  }, {
    key: 'w',
    get: function get() {
      return this.nw[0];
    }
  }, {
    key: 's',
    get: function get() {
      return this.se[1];
    }
  }, {
    key: 'e',
    get: function get() {
      return this.se[0];
    }
  }, {
    key: 'edge',
    get: function get() {
      var a = { longitude: this.w, latitude: this.n };
      var b = { longitude: this.e, latitude: this.s };
      return new _Edge2.default(a, b);
    }
  }], [{
    key: 'generateFromWaypoints',
    value: function generateFromWaypoints(waypoints) {
      var minLat = void 0,
          minLon = void 0,
          maxLat = void 0,
          maxLon = void 0;
      minLat = minLon = Number.MAX_VALUE;
      maxLat = maxLon = Number.MIN_VALUE;

      waypoints.forEach(function (waypoint) {
        if (waypoint.latitude < minLat) minLat = waypoint.latitude;
        if (waypoint.latitude > maxLat) maxLat = waypoint.latitude;
        if (waypoint.longitude < minLon) minLon = waypoint.longitude;
        if (waypoint.longitude > maxLon) maxLon = waypoint.longitude;
      });

      return new BoundedBox([minLon, minLat], [maxLon, maxLat]);
    }
  }]);

  return BoundedBox;
}();

exports.default = BoundedBox;