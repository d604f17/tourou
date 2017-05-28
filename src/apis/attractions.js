import LonelyPlanetAPI from './lonelyplanet';
import GeocodeAPI from './geocode';
import FlickrAPI from './flickr';

class AttractionsAPI {
  constructor({geocode, flickr}) {
    this.lonelyPlanetAPI = new LonelyPlanetAPI();
    this.geocodeAPI = new GeocodeAPI(geocode);
    this.flickrAPI = new FlickrAPI(flickr);
  }

  query(query) {
    return new Promise(resolve => {
      console.log('fetching city');
      this.lonelyPlanetAPI.city(query).then(city => {
        console.log('fetching sights');
        return city.sights();
      }).then(sights => {
        console.log('fetching sight coordinates');
        return this._getLocations(sights);
      }).then(sights => {
        console.log('fetching sight popularity');
        return this._getPopularity(sights);
      }).then(sights => {
        resolve(sights)
      });
    });
  }

  _getLocations(sights) {
    const addresses = sights.map(sight => (
        `${sight['city']['country']} ${sight['city']['city']} ${sight['name']}`
    ));

    return new Promise(resolve => {
      this.geocodeAPI.query(addresses).then(geocodes => {
        let result = [];

        sights.forEach((sight, i) => {
          const geocode = geocodes[i];
          if (geocode.status == 'OK') {
            sight.location = geocode.results[0]['geometry']['location'];
            result.push(sight);
          }
        });

        resolve(result);
      });
    });
  };

  _getPopularity(sights) {
    const photos = sights.map(sight => (
        this.flickrAPI.query('photos.search', {
          lat: sight['lat'],
          lon: sight['lng'],
          text: sight['name'],
        })
    ));

    return new Promise(resolve => {
      Promise.all(photos).then(data => {
        let populaties = data.map(photos => {
          return photos['photos']['total'];
        });

        resolve(sights.map((sight, index) => {
          return Object.assign(sight, {popularity: parseInt(populaties[index]) + 100});
        }));
      });
    });
  }
}

export default AttractionsAPI;