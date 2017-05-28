import qs from 'qs';
import rp from 'request-promise';
import Promise from 'bluebird';

class GeocodeAPI {
  constructor(key) {
    this.key = key;
    this.url = 'https://maps.googleapis.com/maps/api/geocode/json';
  }

  _request(address) {
    return new Promise((resolve) => {
      const parameters = qs.stringify({
        address,
        key: this.key,
      });

      rp({url: this.url + '?' + parameters, json: true}).then(result => {
        resolve(result);
      });
    });
  }

  query(address) {
    if (address.constructor !== Array)
      return this._request(address);

    return new Promise(resolve => {
      const addressRequests = address.map(address => () => this._request(address));

      Promise.map(addressRequests, (request) => {
        return Promise.delay(1000, request());
      }, {concurrency: 50}).then(result => {
        resolve(result);
      });
    });
  }
}

export default GeocodeAPI;