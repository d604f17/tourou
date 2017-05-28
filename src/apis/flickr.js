import qs from 'qs';
import rp from 'request-promise';

class FlickrAPI {
  constructor(key) {
    this.key = key;
    this.url = 'https://api.flickr.com/services/rest';
  }

  query(method, parameters) {
    let query = qs.stringify(Object.assign({
      api_key: this.key,
      method: 'flickr.' + method,
      format: 'json',
      nojsoncallback: 1
    }, parameters));

    return rp({
      url: this.url + '?' + query,
      json: true
    });
  }
}

export default FlickrAPI