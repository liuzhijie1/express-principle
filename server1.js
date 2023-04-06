const express = require('express')



const app = express();

app.get('/', function(req, res, next) {
  console.log('这里是get')
  next()
})
app.use(function(req, res, next) {
  console.log('this')
  next()
})





app.listen(3000);