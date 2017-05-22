class Waypoint {
  static increment = 0;

  constructor(longitude, latitude, value) {
    this.id = ++Waypoint.increment;
    this.longitude = longitude;
    this.latitude = latitude;
    this.value = value;
  }
}

export default Waypoint;