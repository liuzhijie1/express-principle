const http = require('http')
const url = require('url')
const path = require('path')
const Router = require('./router/index')
const methods = require('methods')
function Application() {
  // 把应用和路由分离
  // this._router = new Router(); //  默认一调用express(); 
  // this._router = [{
  //   path: '*',
  //   method: '*',
  //   handler(req, res) {
  //     res.end(`Cannot ${req.method} ${req.url}`)
  //   }  // 默认放一条默认的路由
  // }]
  this.config = [];
}

Application.prototype.set = function (key, value) {
  if (arguments.length === 2) {
    this.config[key] = value;
  } else {
    return this.config[key];
  }
}

Application.prototype.param = function(key, handler) {
  this.lazy_route();
  this._router.param(key, handler)
}

Application.prototype.lazy_route = function () {
  if (!this._router) {
    // 把应用和路由分离
    this._router = new Router(); //  默认一调用express();
  }
}

Application.prototype.use = function (path, handler) {
  this.lazy_route();
  this._router.use(path, handler)
}

methods.forEach(method => {
  Application.prototype[method] = function (path, ...handlers) {
    if (method === 'get' && arguments.length === 1) {
      return this.set(path);
    }
    this.lazy_route();
    this._router[method](path, handlers)
  }
})

// Application.prototype.get = function (path, handler) {
//   this._router.get(path, handler)
//   // this._router.push({
//   //   path,
//   //   method: 'get',
//   //   handler,
//   // })
// }

Application.prototype.listen = function () {
  let server = http.createServer((req, res) => {
    // let { pathname } = url.parse(req.url);
    // let requestMethod = req.method.toLowerCase();

    function done() {
      res.end(`Cannot ${req.method} ${req.url}`)
    }
    this.lazy_route();
    this._router.handle(req, res, done);
    // for (let i = 0; i < this._router.length; i++) {
    //   let { method, path, handler } = this._router[i];
    //   if (pathname === path && requestMethod === method) {
    //     return handler(req, res);
    //   }
    // }
    // return this._router[0].handler(req, res);
  });
  // 没有es6的写法
  // server.listen.apply(server, arguments);
  server.listen(...arguments);
}


module.exports = Application;


