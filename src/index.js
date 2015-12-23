import sassport from 'sassport';
import sass from 'node-sass';
import gonzales from 'gonzales-pe';

const referenceModule = sassport.module('reference')
  .functions({
    'reference($selector)': (selector, done) => {
      let selectorString = selector.getValue();

      let result = transformSelector(selectorString);

      return sass.types.String(result);
    }
  })
  .loaders({
    'reference': (contents, options, done) => {
      if (!contents) {
        console.log(options);
        throw new Error(`The Sass file "${options.absPath}" is either missing or empty.`);
      }

      let tree = gonzales.parse(contents, {
        syntax: 'scss',
        context: 'stylesheet'
      });

      transformSelectors(tree);

      return { contents: tree.toString() };
    }
  });

const referenceLoader = (contents, done) => {
  let tree = gonzales.parse(contents, {
    syntax: 'scss'
  });

  transformSelectors(tree);

  return tree.toString();
}

const referenceIdent = gonzales.createNode({  
  type: 'ident',
  content: 'REF',
  syntax: 'scss'
});

const referenceNode = gonzales.createNode({
  type: 'placeholder',
  content: [referenceIdent],
  syntax: 'scss'
});


const transformSelectors = (node) => {
  if (node.type === 'selector') {
    node.content = node.content
      .map((node) => {
        if (node.type === 'class'
          || node.type === 'id'
          || node.type === 'attributeSelector'
          || node.type === 'typeSelector') {
          return [
            node,
            referenceNode
          ];
        }

        return node;
      })
      .reduce((a, b) => a.concat(b), []);
  }


  node.forEach(transformSelectors);
}

const transformSelector = (selector) => {
  let tree = gonzales.parse(selector, {
    syntax: 'scss',
    context: 'selector'
  });

  transformSelectors(tree);

  return tree.toString();
}

module.exports = referenceModule;
