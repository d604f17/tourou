'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DirectionsAPI = function () {
  function DirectionsAPI(key) {
    _classCallCheck(this, DirectionsAPI);

    this.key = key;
    this.url = 'https://maps.googleapis.com/maps/api/directions/json';
  }

  _createClass(DirectionsAPI, [{
    key: '_request',
    value: function _request(options) {
      var _this = this;

      return new _bluebird2.default(function (resolve, reject) {
        var parameters = _qs2.default.stringify(_extends({}, options, {
          mode: 'walking',
          key: _this.key
        }));

        (0, _requestPromise2.default)({ url: _this.url + '?' + parameters, json: true }).then(function (result) {
          if (result.status === 'OVER_QUERY_LIMIT') {
            reject(result['error_message']);
          } else {
            resolve(result);
          }
        });
      });
    }
  }, {
    key: 'query',
    value: function query(options) {
      var _this2 = this;

      if (options.constructor !== Array) {
        return this._request(options);
      }

      return new _bluebird2.default(function (resolve) {
        var requests = options.map(function (o) {
          return function () {
            return _this2._request(o);
          };
        });

        _bluebird2.default.map(requests, function (request) {
          return _bluebird2.default.delay(1000, request());
        }, { concurrency: 50 }).then(function (result) {
          resolve(result);
        });
      });
    }
  }]);

  return DirectionsAPI;
}();

exports.default = DirectionsAPI;
//# sourceMappingURL=directions.js.map