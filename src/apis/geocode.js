import qs from 'qs';
import rp from 'request-promise';
import Promise from 'bluebird';

class GeocodeAPI {
  constructor(key) {
    this.key = key;
    this.url = 'https://maps.googleapis.com/maps/api/geocode/json';
  }

  _request(address) {
    return new Promise((resolve, reject) => {
      const parameters = qs.stringify({
        address,
        key: this.key,
      });

      rp({url: this.url + '?' + parameters, json: true}).then(result => {
        if (result.status === 'OVER_QUERY_LIMIT') {
          reject(result['error_message']);
        } else {
          resolve(result);
        }
      });
    });
  }

  query(address) {
    if (address.constructor !== Array)
      return this._request(address);

    return new Promise(resolve => {
      const requests = address.map(a => () => this._request(a));

      Promise.map(requests, (request) => {
        return Promise.delay(1000, request());
      }, {concurrency: 50}).then(result => {
        resolve(result);
      });
    });
  }
}

export default GeocodeAPI;