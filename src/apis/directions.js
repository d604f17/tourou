import qs from 'qs';
import rp from 'request-promise';

class DirectionsAPI {
  constructor(key) {
    this.key = key;
    this.url = 'https://maps.googleapis.com/maps/api/directions/json';
  }

  query(parameters) {
    return new Promise((resolve, reject) => {
      const request = (callback) => {
        const query = qs.stringify({
          ...parameters,
          key: this.key,
        });

        return rp({
          url: this.url + '?' + query,
          json: true,
        }).then(result => {
          if (result.status === 'OK') {
            callback(result);
          } else if (result.status === 'OVER_QUERY_LIMIT') {
            if (result.error_message ===
                'You have exceeded your daily request quota for this API.') {
              reject(result.error_message);
            }

            request(callback);
          } else if (result.status === 'ZERO_RESULTS') {
            callback(result);
          } else {
            console.log(result.status);
            request(callback);
          }
        });
      };

      request(function(result) {
        resolve(result);
      });
    });
  }
}

export default DirectionsAPI;