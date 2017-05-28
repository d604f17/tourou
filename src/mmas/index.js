import Colony from './Colony';

const mmas = (vertices, boxes, params) => {
  const colony = new Colony(params);

  vertices.forEach(vertex => {
    colony.getGraph().addVertex(vertex[0], vertex[1], vertex[2]);
  });

  colony.getGraph().createEdges(boxes);
  colony.reset();
  colony.run();

  return colony.getGlobalBest().getTour();
};

export default mmas;