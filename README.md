# Sassport Reference Loader

Import by reference in Sass using Sassport.

## Quick Start
- `npm install sassport sassport-reference --save`
- Add `sassport-reference` to your [Sassport](https://www.github.com/davidkpiano/sassport) modules:

```js
import sassport from 'sassport';
import sassportReference from 'sassport-reference';

sassport([ sassportReference ])
  .render({
    file: 'path/to/stylesheet.scss'
  }, (err, result) => {
    console.log(result.css.toString());
    
    // Output the result CSS however you'd like
  });
```

And just add the `!reference` loader to any imported SCSS file you want to include by reference:

```scss
// Imported file
@for $i from 1 through 12 {
  .col-#{$i} {
    float: left;
    width: percentage($i / 12);
  }
}
```

**Input SCSS:**
```scss
@import 'path/to/grid !reference';

.half {
  @extend #{reference('.col-6')};
  
  // Alternatively:
  @extend %REF.col-6;
}
```

**Result CSS:**
```css
.half {
  float: left;
  width: 50%;
}
```

Only the CSS you reference will be output. You can use extended referenced selectors in the same way as you would use any other extended selector.
