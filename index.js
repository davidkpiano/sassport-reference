var sassport = require('sassport');
var spReference = require('./dist/index.js');

sassport([spReference])
  .render({
    file: 'index.scss'
  }, function(err, res) {
    console.log(res.css.toString());
  });