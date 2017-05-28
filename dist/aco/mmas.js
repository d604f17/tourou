'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Colony = require('./Colony');

var _Colony2 = _interopRequireDefault(_Colony);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var util = require('util');


var mmas = function mmas(vertices, boxes, params) {
  var colony = new _Colony2.default(params);

  vertices.forEach(function (vertex) {
    colony.getGraph().addVertex(vertex[0], vertex[1], vertex[2]);
  });

  colony.getGraph().createEdges(boxes);
  colony.reset();
  colony.run();
  return colony.getGlobalBest().getTour();
};

exports.default = mmas;
//# sourceMappingURL=mmas.js.map