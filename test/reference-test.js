import assert from 'assert';
import sassport from 'sassport';
import spReference from '../dist/index.js';

describe('Sassport reference loader', () => {
  it('should not load the contents of a referenced file in the output CSS', (done) => {
    sassport([ spReference ])
      .render({
        data: `
          @import 'test/fixtures/grid !reference';
        `
      }, (err, result) => {
        err && console.error(err);

        done(assert.equal(result.css.toString(), ''));
      });
  });

  it('should throw an error if referenced file not found', (done) => {
    sassport([ spReference ])
      .render({
        data: `
          @import 'test/fixtures/nonexistant !reference';
        `
      }, (err, result) => {
        done(assert.throws(() => {
          if (err) throw err;

          return result.css.toString();
        }));
      });
  });
});

describe('reference() function', () => {
  it('should return an extendable reference selector', (done) => {
    sassport([ spReference ])
      .render({
        data: `
          test {
            class: inspect(reference('.foo'));
            type: inspect(reference('div'));
            id: inspect(reference('#foo'));
            attr: inspect(reference('[type="text"]'));
            compound-1: inspect(reference('#foo.bar'));
            compound-2: inspect(reference('#foo[bar]'));
            compound-3: inspect(reference('#foo[bar].baz'));
            compound-4: inspect(reference('foo#bar'));
            compound-5: inspect(reference('foo.bar'));
            compound-6: inspect(reference('.foo[bar]'));
            compound-7: inspect(reference('.foo.bar.baz'));
          }
        `,
        outputStyle: 'compressed'
      }, (err, result) => {
        err && console.error(err);

        done(assert.equal(result.css.toString(), 'test{class:.foo%REF;type:div%REF;id:#foo%REF;attr:[type="text"]%REF;compound-1:#foo%REF.bar%REF;compound-2:#foo%REF[bar]%REF;compound-3:#foo%REF[bar]%REF.baz%REF;compound-4:foo%REF#bar%REF;compound-5:foo%REF.bar%REF;compound-6:.foo%REF[bar]%REF;compound-7:.foo%REF.bar%REF.baz%REF}\n'));
      });
  });

  it('should extend referenced selectors', (done) => {
    sassport([ spReference ])
      .render({
        data: `
          @import 'test/fixtures/grid !reference';

          .half { @extend #{reference('.col-50')} }
        `,
        outputStyle: 'compressed'
      }, (err, result) => {
        err && console.error(err);

        done(assert.equal(result.css.toString(), '.half{width:50%}\n'));
      });
  });

  it('should respect combinator relationships in extended selectors', (done) => {
    sassport([ spReference ])
      .render({
        data: `
          @import 'test/fixtures/grid !reference';

          .quarter { @extend #{reference('.col-25')} }
          .the-rest { @extend #{reference('.col-flex')} }
        `,
        outputStyle: 'compressed'
      }, (err, result) => {
        err && console.error(err);

        done(assert.equal(result.css.toString(), '.quarter{width:25%}.quarter+.the-rest{width:75%}\n'));
      });
  });

  it('should extend selectors inside mixins', (done) => {
    sassport([ spReference ])
      .render({
        data: `
          @import 'test/fixtures/grid !reference';

          .from-mixin { @extend #{reference('.inside-mixin')} }
        `,
        outputStyle: 'compressed'
      }, (err, result) => {
        err && console.error(err);

        done(assert.equal(result.css.toString(), '.from-mixin{color:green}\n'));
      });
  });

  it('should permit usage of %REF placeholder for raw extending', (done) => {
    sassport([ spReference ])
      .render({
        data: `
          @import 'test/fixtures/grid !reference';

          .quarter { @extend %REF.col-25 }
          .the-rest { @extend %REF.col-flex }
        `,
        outputStyle: 'compressed'
      }, (err, result) => {
        err && console.error(err);

        done(assert.equal(result.css.toString(), '.quarter{width:25%}.quarter+.the-rest{width:75%}\n'));
      });
  });
});
