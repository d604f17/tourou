'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lonelyplanet = require('./lonelyplanet');

var _lonelyplanet2 = _interopRequireDefault(_lonelyplanet);

var _geocode = require('./geocode');

var _geocode2 = _interopRequireDefault(_geocode);

var _flickr = require('./flickr');

var _flickr2 = _interopRequireDefault(_flickr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AttractionsAPI = function () {
  function AttractionsAPI(_ref) {
    var geocode = _ref.geocode,
        flickr = _ref.flickr;

    _classCallCheck(this, AttractionsAPI);

    this.lonelyPlanetAPI = new _lonelyplanet2.default();
    this.geocodeAPI = new _geocode2.default(geocode);
    this.flickrAPI = new _flickr2.default(flickr);
  }

  _createClass(AttractionsAPI, [{
    key: 'query',
    value: function query(_query) {
      var _this = this;

      return new Promise(function (resolve) {
        console.log('fetching city');
        _this.lonelyPlanetAPI.city(_query).then(function (city) {
          console.log('fetching sights');
          return city.sights();
        }).then(function (sights) {
          console.log('fetching sight coordinates');
          return _this._getLocations(sights);
        }).then(function (sights) {
          console.log('fetching sight popularity');
          return _this._getPopularity(sights);
        }).then(function (sights) {
          resolve(sights);
        });
      });
    }
  }, {
    key: '_getLocations',
    value: function _getLocations(sights) {
      var _this2 = this;

      var addresses = sights.map(function (sight) {
        return sight['city']['country'] + ' ' + sight['city']['city'] + ' ' + sight['name'];
      });

      return new Promise(function (resolve) {
        _this2.geocodeAPI.query(addresses).then(function (geocodes) {
          var result = [];

          sights.forEach(function (sight, i) {
            var geocode = geocodes[i];
            if (geocode.status == 'OK') {
              sight.location = geocode.results[0]['geometry']['location'];
              result.push(sight);
            }
          });

          resolve(result);
        });
      });
    }
  }, {
    key: '_getPopularity',
    value: function _getPopularity(sights) {
      var _this3 = this;

      var photos = sights.map(function (sight) {
        return _this3.flickrAPI.query('photos.search', {
          lat: sight['lat'],
          lon: sight['lng'],
          text: sight['name']
        });
      });

      return new Promise(function (resolve) {
        Promise.all(photos).then(function (data) {
          var populaties = data.map(function (photos) {
            return photos['photos']['total'];
          });

          resolve(sights.map(function (sight, index) {
            return Object.assign(sight, { popularity: parseInt(populaties[index]) + 100 });
          }));
        });
      });
    }
  }]);

  return AttractionsAPI;
}();

exports.default = AttractionsAPI;
//# sourceMappingURL=attractions.js.map