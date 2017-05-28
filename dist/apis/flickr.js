'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FlickrAPI = function () {
  function FlickrAPI(key) {
    _classCallCheck(this, FlickrAPI);

    this.key = key;
    this.url = 'https://api.flickr.com/services/rest';
  }

  _createClass(FlickrAPI, [{
    key: 'query',
    value: function query(method, parameters) {
      var query = _qs2.default.stringify(Object.assign({
        api_key: this.key,
        method: 'flickr.' + method,
        format: 'json',
        nojsoncallback: 1
      }, parameters));

      return (0, _requestPromise2.default)({
        url: this.url + '?' + query,
        json: true
      });
    }
  }]);

  return FlickrAPI;
}();

exports.default = FlickrAPI;
//# sourceMappingURL=flickr.js.map