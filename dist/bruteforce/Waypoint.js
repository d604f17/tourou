"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Waypoint = function Waypoint(longitude, latitude, value) {
  _classCallCheck(this, Waypoint);

  this.id = ++Waypoint.increment;
  this.longitude = longitude;
  this.latitude = latitude;
  this.value = value;
};

Waypoint.increment = 0;
exports.default = Waypoint;
//# sourceMappingURL=Waypoint.js.map