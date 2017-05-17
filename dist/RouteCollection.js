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

    this.routes = routes;
  }

  _createClass(RouteCollection, [{
    key: "shift",
    value: function shift() {
      return this.routes.shift();
    }
  }, {
    key: "sort",
    value: function sort(func) {
      this.routes.sort(func);
    }
  }, {
    key: "add",
    value: function add(route) {
      return this.routes.push(route);
    }
  }, {
    key: "extract",
    value: function extract(route) {
      var matches = this.routes.filter(function (r) {
        return r.hash === route.hash;
      });

      if (matches.length > 0) {
        return this.routes.splice(this.routes.indexOf(matches[0]), 1)[0];
      } else {
        return null;
      }
    }
  }, {
    key: "replaceIfBetter",
    value: function replaceIfBetter(route) {
      var matches = this.routes.filter(function (r) {
        return r.hash === route.hash;
      });

      if (matches.length > 0) {
        var match = this.routes.splice(this.routes.indexOf(matches[0]), 1)[0];

        if (route.distance < match.distance) {
          this.add(route);
        } else {
          this.add(match);
        }
      } else {
        this.add(route);
      }
    }
  }, {
    key: "length",
    get: function get() {
      return this.routes.length;
    }
  }, {
    key: "first",
    get: function get() {
      return this.routes[0];
    }
  }]);

  return RouteCollection;
}();

exports.default = RouteCollection;