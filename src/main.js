import mmas from './mmas';
import directions from './directions';
import diagonalization from './strategies/diagonalization';
import AttractionAPI from './apis/attractions';
import BoundedBox from './BoundedBox';

const attractionAPI = new AttractionAPI({
  geocode: 'AIzaSyC6rAQ1c46pBfRcnQwSidnpGBeeumnhmjU',
  flickr: '85f11febb88e3a4d49342a95b7bcf1e8',
});

const cities = {
  'copenhagen': 'denmark/copenhagen',
};

const city = process.argv[process.argv.length - 2];
const maxDistance = process.argv[process.argv.length - 1];
const start = new Date().getTime();

if (city in cities) {
  attractionAPI.query(cities[city]).then(attractions => {
    const waypoints = attractions.map(attraction => {
      return [
        attraction['location']['lng'],
        attraction['location']['lat'],
        attraction['popularity']];
    });

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
        mode: 'walking',
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

        console.log(route);
      });
    });
  }).catch(console.error);
}
