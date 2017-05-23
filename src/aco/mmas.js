const util = require('util');
import Colony from './Colony';

const mmas = (vertices) => {
  const colony = new Colony();

  vertices.forEach(vertex => {
    colony.getGraph().addVertex(vertex[0], vertex[1], vertex[2]);
  });

  colony.getGraph().createEdges();
  colony.reset();
  colony.run();
  console.log('result', colony.getGlobalBest().getTour());
  // console.log(util.inspect(colony.getGlobalBest().getTour(), false, null));
};

export default mmas;