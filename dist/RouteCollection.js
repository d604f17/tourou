"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RouteCollection = function () {
  function RouteCollection() {
    var routes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    _classCallCheck(this, RouteCollection);

    this.length = 0;

    this.routes = routes;
    this.length = routes.length;
  }

  _createClass(RouteCollection, [{
    key: "shift",
    value: function shift() {
      var result = this.routes.shift();

      if (result) {
        this.length -= 1;
        return result;
      }
    }
  }, {
    key: "add",
    value: function add(route) {
      var result = this.routes.push(route);

      if (result) {
        this.length += 1;
        return result;
      }
    }
  }, {
    key: "containsRoute",
    value: function containsRoute(route) {
      return this.routes.filter(function (r) {
        return r.getHashCode() === route.getHashCode();
      }).length > 0;
    }
  }]);

  return RouteCollection;
}();

exports.default = RouteCollection;