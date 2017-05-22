import Colony from './Colony';

const mmas = (vertices) => {
  const colony = new Colony();

  vertices.forEach(vertex => {
    colony.getGraph().addVertex(vertex.x, vertex.y, vertex.value);
  });

  colony.getGraph().createEdges();
  colony.reset();
  colony.run();
  console.log(colony.getGlobalBest().getTour());
};

export default mmas;