class RouteCollection {
  routes = {};

  get length() {
    return Object.keys(this.routes).length;
  }

  add(route) {
    this.routes[route.hash] = route;
  }

  shift() {
    const key = Object.keys(this.routes)[0];
    const route = this.routes[key];
    delete this.routes[key];
    return route;
  }

  addOrReplaceIfLowerDistance(route) {
    let match = this.routes[route.hash];

    if (match) {
      if (route.distance > match.distance) {
        this.routes[route.hash] = route;
      }
    } else {
      this.add(route);
    }
  }

  toArray() {
    return Object.keys(this.routes).map(key => this.routes[key]);
  }
}

export default RouteCollection;