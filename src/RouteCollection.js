class RouteCollection extends Array {
  get first() {
    return this[0];
  }

  get last() {
    return this.length < 1 ? this : this[this.length - 1];
  }

  pushOrReplaceIfLowerDistance(route) {
    const matches = this.filter(r => r.hash === route.hash);

    if (matches.length > 0) {
      const index = this.indexOf(matches[0]);
      const match = this.splice(index, 1)[0];

      if (route.distance < match.distance) {
        this.splice(index, 0, route);
      } else {
        this.splice(index, 0, match);
      }
    } else {
      this.push(route);
    }
  }
}

export default RouteCollection;