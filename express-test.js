const express = require('express')
const app = express();
// koa 和 express 的区别 koa 他的特点是把promise组合起来可以实现等待
// express 不能实现
app.use(function (req, res, next) {
  const start = Date.now();
  let oldEnd = res.end;
  res.end = function (value) {
    const end = Date.now();
    console.log(end - start);
    oldEnd.call(res, value);
  }
  next();
  // console.log(1)
  // next()
  // console.log(2)
})

// app.use(function (req, res, next) {
//   console.log(3)
//   next()
//   console.log(4)
// })


// app.use(function (req, res, next) {
//   console.log(5)
//   next()
//   console.log(6)
// })


app.get('/', function (req, res, next) {
  setTimeout(() => {
    res.end('/')
  }, 1000)
})



app.get('/user', function () {
  res.end('/user')
})


/**
 * 1
 * 3
 * 5
 * 6
 * 4
 * 2
 */


app.listen(3000)