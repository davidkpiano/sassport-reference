'use strict';

var _sassport = require('sassport');

var _sassport2 = _interopRequireDefault(_sassport);

var _nodeSass = require('node-sass');

var _nodeSass2 = _interopRequireDefault(_nodeSass);

var _gonzalesPe = require('gonzales-pe');

var _gonzalesPe2 = _interopRequireDefault(_gonzalesPe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var referenceModule = _sassport2.default.module('reference').functions({
  'reference($selector)': function reference$selector(selector, done) {
    var selectorString = selector.getValue();

    var result = transformSelector(selectorString);

    return _nodeSass2.default.types.String(result);
  }
}).loaders({
  'reference': function reference(contents, options, done) {
    if (!contents) {
      console.log(options);
      throw new Error('The Sass file "' + options.absPath + '" is either missing or empty.');
    }

    var tree = _gonzalesPe2.default.parse(contents, {
      syntax: 'scss',
      context: 'stylesheet'
    });

    transformSelectors(tree);

    return { contents: tree.toString() };
  }
});

var referenceLoader = function referenceLoader(contents, done) {
  var tree = _gonzalesPe2.default.parse(contents, {
    syntax: 'scss'
  });

  transformSelectors(tree);

  return tree.toString();
};

var referenceIdent = _gonzalesPe2.default.createNode({
  type: 'ident',
  content: 'REF',
  syntax: 'scss'
});

var referenceNode = _gonzalesPe2.default.createNode({
  type: 'placeholder',
  content: [referenceIdent],
  syntax: 'scss'
});

var transformSelectors = function transformSelectors(node) {
  if (node.type === 'selector') {
    node.content = node.content.map(function (node) {
      if (node.type === 'class' || node.type === 'id' || node.type === 'attributeSelector' || node.type === 'typeSelector') {
        return [node, referenceNode];
      }

      return node;
    }).reduce(function (a, b) {
      return a.concat(b);
    }, []);
  }

  node.forEach(transformSelectors);
};

var transformSelector = function transformSelector(selector) {
  var tree = _gonzalesPe2.default.parse(selector, {
    syntax: 'scss',
    context: 'selector'
  });

  transformSelectors(tree);

  return tree.toString();
};

module.exports = referenceModule;