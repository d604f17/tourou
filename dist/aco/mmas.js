'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Colony = require('./Colony');

var _Colony2 = _interopRequireDefault(_Colony);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mmas = function mmas(vertices) {
  var colony = new _Colony2.default();

  vertices.forEach(function (vertex) {
    colony.getGraph().addVertex(vertex.x, vertex.y, vertex.value);
  });

  colony.getGraph().createEdges();
  colony.reset();
  colony.run();
  console.log(colony.getGlobalBest().getTour());
};

exports.default = mmas;
//# sourceMappingURL=mmas.js.map