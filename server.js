const express = require('./express')
const app = express();
const user = express.Router();






// app.get('/', function(req, res) {
//   res.end('/')
// })

// app.get('/hello', function(req, res) {
//   res.end('/hello')
// })

// app.all('*', function(req, res) {
//   res.end('404')
// })

// app.get('/a', function (req, res, next) {
//   console.log(1);
//   next();
// }, function(req, res, next) {
//   console.log(11)
//   next()
// }, function(req, res, next) {
//   console.log(111);
//   next();
// }, function (req, res, next) {
//   console.log(1111);
//   next();
// })

// app.post('/a', function(req, res, next) {
//   console.log(2);
//   res.end('ok')
// })

// app.get('/a', function (req, res, next){
//   console.log(2);
//   res.end('ok')
// }) 
user.get('/add', function(req, res, next) {
  res.end('user add')
})

user.get('/remove', function(req, res, next) {
  res.end('user remove')
})
app.use('/user', user)

app.param('id', function (req, res, next, value, key) {
  req.params.id = value + 10;
  next();
})

app.param('id', function (req, res, next, value, key) {
  req.params.id = value - 5;
  next();
})

app.param('name', function (req, res, next, value, key) {
  req.params.name = value + 'px';
  next();
})

app.get('/zf/:id/:name', function (req, res, next) {
  res.end(JSON.stringify(req.params))
})

app.get('/', function (req, res, next) {
  res.end('ok')
})

// app.get('/', function (req, res) {
//   res.end('home')
// })

// app.get('/zf/:id/:name', function (req, res, next) {
//   res.end(JSON.stringify(req.params))
// })

app.listen(3000)


// NOTE 中间件的理解
// 1、中间件的概念， 控制是否向下执行
// 2、中间件 可以扩展 req 和 res中的方法
// 3、中间件一般放在路由之前执行， 但是放在路径之后在调用next()后，也是可以执行的。
// 3、中间件 可以提前处理一些逻辑和 koa 是一样的
// 4、中间件是前缀匹配， 路径是全量匹配
// 5、express 中的中间件可以放置路径， 这个路径的规则和cookie 中 path一样，是前缀匹配
// 6、koa中间件好像不可以放置路径