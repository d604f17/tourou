'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _haversine = require('haversine');

var _haversine2 = _interopRequireDefault(_haversine);

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
    key: 'haversineDistance',
    get: function get() {
      var a = { longitude: this.w, latitude: this.n };
      var b = { longitude: this.e, latitude: this.s };
      return Math.round((0, _haversine2.default)(a, b, { unit: 'meter' }));
    }
  }], [{
    key: 'generateFromWaypoints',
    value: function generateFromWaypoints(waypoints) {
      var minLat = void 0,
          minLon = void 0,
          maxLat = void 0,
          maxLon = void 0;
      minLat = minLon = Number.MAX_SAFE_INTEGER;
      maxLat = maxLon = Number.MIN_SAFE_INTEGER;

      waypoints.forEach(function (waypoint) {
        var _waypoint = _slicedToArray(waypoint, 2),
            longitude = _waypoint[0],
            latitude = _waypoint[1];

        if (latitude < minLat) minLat = latitude;
        if (latitude > maxLat) maxLat = latitude;
        if (longitude < minLon) minLon = longitude;
        if (longitude > maxLon) maxLon = longitude;
      });

      return new BoundedBox([minLon, maxLat], [maxLon, minLat]);
    }
  }]);

  return BoundedBox;
}();

exports.default = BoundedBox;
//# sourceMappingURL=BoundedBox.js.map