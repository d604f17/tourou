export default class Waypoint {
  static increment = 0;

  constructor(latitude, longitude, value) {
    this.id = ++Waypoint.increment;
    this.latitude = latitude;
    this.longitude = longitude;
    this.value = value;
  }

  getDistanceToWaypoint(waypoint) {
    const radius = 6371;
    const toRadians = function(degrees) {
      return degrees * Math.PI / 180;
    };
    const dLatitude = toRadians(waypoint.latitude - this.latitude);
    const dLongitude = toRadians(waypoint.longitude - this.longitude);
    const latitude1 = toRadians(this.latitude);
    const latitude2 = toRadians(waypoint.latitude);
    const a = Math.sin(dLatitude / 2) *
        Math.sin(dLatitude / 2) +
        Math.sin(dLongitude / 2) *
        Math.sin(dLongitude / 2) *
        Math.cos(latitude1) *
        Math.cos(latitude2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return radius * c;
  }
}