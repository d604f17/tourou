export default class RouteCollection {
  constructor(routes = []) {
    this.routes = routes;
  }

  get length() {
    return this.routes.length;
  }

  get first() {
    return this.routes[0];
  }

  shift() {
    return this.routes.shift();
  }

  sort(func) {
    this.routes.sort(func);
  }

  add(route) {
    return this.routes.push(route);
  }

  extract(route) {
    const matches = this.routes.filter(r => r.hash === route.hash);

    if (matches.length > 0) {
      return this.routes.splice(this.routes.indexOf(matches[0]), 1)[0];
    } else {
      return null;
    }
  }

  replaceIfBetter(route) {
    const matches = this.routes.filter(r => r.hash === route.hash);

    if (matches.length > 0) {
      const match = this.routes.splice(this.routes.indexOf(matches[0]), 1)[0];

      if (route.distance < match.distance) {
        this.add(route);
      } else {
        this.add(match);
      }
    } else {
      this.add(route);
    }
  }
}