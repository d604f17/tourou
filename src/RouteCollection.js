export default class RouteCollection {
  length = 0;

  constructor(routes = []) {
    this.routes = routes;
    this.length = routes.length;
  }

  shift() {
    let result = this.routes.shift();

    if (result) {
      this.length -= 1;
      return result;
    }
  }

  push(route) {
    let result = this.routes.push(route);

    if (result) {
      this.length += 1;
      return result;
    }
  }

  containsRoute(route) {
    return this.routes.filter(r => r.getHashCode() === route.getHashCode()).length > 0;
  }
}