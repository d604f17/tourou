"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Waypoint = function () {
  function Waypoint(latitude, longitude, value) {
    _classCallCheck(this, Waypoint);

    this.id = ++Waypoint.increment;
    this.latitude = latitude;
    this.longitude = longitude;
    this.value = value;
  }

  _createClass(Waypoint, [{
    key: "getDistanceToWaypoint",
    value: function getDistanceToWaypoint(waypoint) {
      var radius = 6371;
      var toRadians = function toRadians(degrees) {
        return degrees * Math.PI / 180;
      };
      var dLatitude = toRadians(waypoint.latitude - this.latitude);
      var dLongitude = toRadians(waypoint.longitude - this.longitude);
      var latitude1 = toRadians(this.latitude);
      var latitude2 = toRadians(waypoint.latitude);
      var a = Math.sin(dLatitude / 2) * Math.sin(dLatitude / 2) + Math.sin(dLongitude / 2) * Math.sin(dLongitude / 2) * Math.cos(latitude1) * Math.cos(latitude2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return radius * c;
    }
  }]);

  return Waypoint;
}();

Waypoint.increment = 0;
exports.default = Waypoint;