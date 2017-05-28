import mmas from './mmas';
import directions from './directions';
import diagonalization from './strategies/diagonalization';
import AttractionAPI from './apis/attractions';
import GeocodeAPI from './apis/geocode';
import BoundedBox from './BoundedBox';

const geocodeAPI = new GeocodeAPI('AIzaSyAUMhnd_8pvLLYFvUkuAF612fXbLSSyCLc');

const attractionAPI = new AttractionAPI({
  geocode: 'AIzaSyAUMhnd_8pvLLYFvUkuAF612fXbLSSyCLc',
  flickr: '85f11febb88e3a4d49342a95b7bcf1e8',
});

const cities = {
  'aalborg': 'denmark/jutland/aalborg',
  'copenhagen': 'denmark/copenhagen',
  'aarhus': 'denmark/aarhus',
  'madrid': 'spain/madrid',
  'berlin': 'germany/berlin',
  'perth': 'australia/western-australia/perth',
  'rio de janeiro': 'brazil/rio-de-janeiro',
  'rome': 'italy/rome',
  'mexico city': 'mexico/mexico-city',
  'barcelona': 'spain/barcelona',
  'new york city': 'usa/new-york-city',
  'venice': 'italy/venice',
  'johannesburg': 'south-africa/gauteng/johannesburg',
  'cairo': 'egypt/cairo',
  'los angeles': 'usa/los-angeles',
  'bern': 'switzerland/bern',
  'las vegas': 'usa/las-vegas',
  'london': 'england/london',
  'dallas': '/usa/texas/dallas',
  'honolulu': '/usa/honolulu-and-waikiki',
  'stockholm': '/sweden/stockholm',
  'oslo': '/norway/oslo',
  'amsterdam': '/the-netherlands/amsterdam',
  'brussels': '/belgium/brussels',
  'vienna': '/austria/vienna',
  'zurich': '/switzerland/zurich',
  'paris': '/france/paris',
  'lisbon': '/portugal/lisbon',
  'athens': '/greece/athens',
};

const road = process.argv[process.argv.length - 4].toLowerCase();
const city = process.argv[process.argv.length - 3].toLowerCase();
const country = process.argv[process.argv.length - 2].toLowerCase();
const maxDistance = process.argv[process.argv.length - 1];

const start = new Date().getTime();

if (city in cities) {
  attractionAPI.query(cities[city]).then(attractions => {
    if (attractions.length) {
      geocodeAPI.query(`${road}, ${city}, ${country}`).then(geocode => {
        const location = geocode.results[0]['geometry']['location'];

        const waypoints = attractions.map(attraction => {
          return [
            attraction['location']['lng'],
            attraction['location']['lat'],
            attraction['popularity']];
        });

        waypoints.unshift([location.lng, location.lat, 0]);

        const boundexBox = BoundedBox.generateFromWaypoints(waypoints);

        const regression = (x) => {
          return Math.round(27.80137609 * Math.log(x) - 122.02143175);
        };

        console.log('running diagonalization');
        diagonalization(waypoints, regression(boundexBox.area)).then(boxes => {
          const route = mmas(waypoints, boxes, {maxDistance});

          const coordinates = route._tour.map(vertex => {
            return vertex.y + ',' + vertex.x;
          });

          console.log('fetching real distance');
          directions.query({
            origin: coordinates.shift(),
            destination: coordinates.pop(),
            waypoints: coordinates.join('|'),
          }).then(result => {
            const legs = result.routes[0]['legs'];
            const distances = legs.map(leg => leg.distance.value);
            route._heuristicDistance = route._distance;
            route._distance = distances.reduce((a, b) => a + b);
            route._distance += 2500 * (legs.length - 2);
            route._runtime = new Date().getTime() - start;
            delete route._graph;

            if (route._tour.length > 2) {
              console.log(route);
            } else {
              console.log('no route found with that maximum distance.');
            }
          });
        });
      });
    }
  }).catch(console.error);
}
