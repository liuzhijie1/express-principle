const express = require('./express')
const app = express();

app.set('views', 'view');

app.set('view engine', 'html');

// app.engine('.html', require('ejs').__express);

// app.get('/', function (req, res, next) {
//   res.render('hello', {name: 'zf'})    // ejs   jade
// })

console.log(app.set('views'));


app.get('/', function (req, res, next) {
  res.end('ok')
})


app.listen(3000)