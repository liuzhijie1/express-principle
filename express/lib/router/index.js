const url = require('url')
const Route = require('./route')
const Layer = require('./layer')
const methods = require('methods');
function Router() {
  let router = (req, res, next) => {
    router.handle(req, res, next);
  }
  router.stack = [];
  router.__proto__ = proto;
  router.paramsCallback = {};
  return router;   // 通过原型链来查找
}

let proto = {};

proto.param = function (key, handler) {
   if (this.paramsCallback[key]) {
    this.paramsCallback[key].push(handler)
   } else {
    this.paramsCallback[key] = [handler]
   }
}

proto.route = function (path) {
  let route = new Route();
  let layer = new Layer(path, route.dispatch.bind(route));
  layer.route = route;
  this.stack.push(layer);
  return route;
}

proto.use = function (path, handler) {
  if (typeof path === 'function') {
    handler = path;
    path = '/';
  }
  let layer = new Layer(path, handler);
  layer.route = undefined;
  this.stack.push(layer)
}

methods.forEach(method => {
  proto[method] = function (path, ...handlers) {
    let route = this.route(path);
    route[method](...handlers);
  }
})

// Router.prototype.get = function (path, handlers) {
//   let route = this.route(path);
//   route.get(handlers);
// }

proto.process_params = function (layer, req, res, done) {
  // 当没有匹配出来key的时候
  if (!layer.keys || layer.keys.length === 0) {
    return done();
  }

  let keys = layer.keys.map((item) => item.name);
  let params = this.paramsCallback;
  let idx = 0;
  function next() {
    if (keys.length === idx) return done();
    let key = keys[idx++];
    processCallback(key, next);
  }
  next();
  function processCallback(key, out) {  // id
     let fns = params[key];
     let idx = 0;
     let value = req.params[key];
     function next() {
      if (fns.length === idx) return out();
      let fn = fns[idx++];
      fn(req, res, next, value, key);
     }
     next();
  }
}

proto.handle = function (req, res, out) {
  let { pathname } = url.parse(req.url);
  let idx = 0;
  let removed = '';
  let dispatch = (err) => {
    if (idx === this.stack.length) return out();

    if (removed) {
      req.url = removed + req.url;
      removed = '';
    }

    let layer = this.stack[idx++];
    if (err) {
      if (!layer.route) {
        // 必须中间件处理函数的参数， 必须要有4个参数
        // layer.handler.length === 4
        layer.handle_error(err, req, res, dispatch)
      } else {
        // 是路由直接忽略
        dispatch(err)
      }
    } else {
      if (layer.match(pathname)) {
        if (!layer.route && layer.handler.length !== 4) {

          if (layer.path !== '/') {
            removed = layer.path;
            req.url = req.url.slice(removed.length)
          }
          layer.handle_request(req, res, dispatch);
        } else {
          if (layer.route.methods[req.method.toLowerCase()]) {
            req.params = layer.params;

            this.process_params(layer, req, res, () => {
              debugger
              layer.handle_request(req, res, dispatch);
            })
          } else {
            dispatch();
          }
        }
      } else {
        dispatch();
      }
    }

    // if (layer.match(pathname) && layer.route.methods[req.method.toLowerCase()]) {
    //   layer.handle_request(req, res, dispatch);
    // } else {
    //   dispatch();
    // }
  }
  dispatch();
}

module.exports = Router;