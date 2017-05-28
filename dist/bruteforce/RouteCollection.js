"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RouteCollection = function () {
  function RouteCollection() {
    _classCallCheck(this, RouteCollection);

    this.routes = {};
  }

  _createClass(RouteCollection, [{
    key: "add",
    value: function add(route) {
      this.routes[route.hash] = route;
    }
  }, {
    key: "shift",
    value: function shift() {
      var key = Object.keys(this.routes)[0];
      var route = this.routes[key];
      delete this.routes[key];
      return route;
    }
  }, {
    key: "addOrReplaceIfLowerDistance",
    value: function addOrReplaceIfLowerDistance(route) {
      var match = this.routes[route.hash];

      if (match) {
        if (route.distance > match.distance) {
          this.routes[route.hash] = route;
        }
      } else {
        this.add(route);
      }
    }
  }, {
    key: "toArray",
    value: function toArray() {
      var _this = this;

      return Object.keys(this.routes).map(function (key) {
        return _this.routes[key];
      });
    }
  }, {
    key: "length",
    get: function get() {
      return Object.keys(this.routes).length;
    }
  }]);

  return RouteCollection;
}();

exports.default = RouteCollection;
//# sourceMappingURL=RouteCollection.js.map