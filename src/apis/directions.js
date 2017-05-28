import qs from 'qs';
import rp from 'request-promise';
import Promise from 'bluebird';

class DirectionsAPI {
  constructor(key) {
    this.key = key;
    this.url = 'https://maps.googleapis.com/maps/api/directions/json';
  }

  _request(options) {
    return new Promise((resolve, reject) => {
      const parameters = qs.stringify({
        ...options,
        mode: 'walking',
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

  query(options) {
    if (options.constructor !== Array) {
      return this._request(options);
    }

    return new Promise(resolve => {
      const requests = options.map(o => () => this._request(o));

      Promise.map(requests, (request) => {
        return Promise.delay(1000, request());
      }, {concurrency: 50}).then(result => {
        resolve(result);
      });
    });
  }
}

export default DirectionsAPI;