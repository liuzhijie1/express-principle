const Layer = require('./layer')
const methods = require('methods')
function Route() {
  this.stack = [];
  this.methods = {}; // 表示当前route中有那些方法  
}

Route.prototype.dispatch = function (req, res, out) {
  let idx = 0;
  let method = req.method.toLowerCase();
  let dispatch = (err) => {
    if (err) return out(err)
    console.log('inner')
    if (idx === this.stack.length) return out();
    let layer = this.stack[idx++];
    if (layer.method === method) { 
      console.log('zhelimian')
      layer.handle_request(req, res, dispatch)
    } else {
      dispatch();
    }
  }
  dispatch();
}


methods.forEach(method => {
  Route.prototype[method] = function (handlers) {
    if (!Array.isArray(handlers)) handlers = [handlers];
    handlers.forEach(handler => {
      let layer = new Layer('/', handler);
      layer.method = method;
      this.methods[method] = true;
      this.stack.push(layer)
    })
  }
})

module.exports = Route;