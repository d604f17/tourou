"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _extendableBuiltin(cls) {
  function ExtendableBuiltin() {
    var instance = Reflect.construct(cls, Array.from(arguments));
    Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
    return instance;
  }

  ExtendableBuiltin.prototype = Object.create(cls.prototype, {
    constructor: {
      value: cls,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(ExtendableBuiltin, cls);
  } else {
    ExtendableBuiltin.__proto__ = cls;
  }

  return ExtendableBuiltin;
}

var RouteCollection = function (_extendableBuiltin2) {
  _inherits(RouteCollection, _extendableBuiltin2);

  function RouteCollection() {
    _classCallCheck(this, RouteCollection);

    return _possibleConstructorReturn(this, (RouteCollection.__proto__ || Object.getPrototypeOf(RouteCollection)).apply(this, arguments));
  }

  _createClass(RouteCollection, [{
    key: "pushOrReplaceIfLowerDistance",
    value: function pushOrReplaceIfLowerDistance(route) {
      var matches = this.filter(function (r) {
        return r.hash === route.hash;
      });

      if (matches.length > 0) {
        var index = this.indexOf(matches[0]);
        var match = this.splice(index, 1)[0];

        if (route.distance < match.distance) {
          this.splice(index, 0, route);
        } else {
          this.splice(index, 0, match);
        }
      } else {
        this.push(route);
      }
    }
  }, {
    key: "first",
    get: function get() {
      return this[0];
    }
  }, {
    key: "last",
    get: function get() {
      return this.length < 1 ? this : this[this.length - 1];
    }
  }]);

  return RouteCollection;
}(_extendableBuiltin(Array));

exports.default = RouteCollection;