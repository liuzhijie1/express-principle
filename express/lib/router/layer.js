 const pathToRegExp = require('path-to-regexp')

function Layer(path, handler) {
  this.path = path;
  this.handler = handler;

  this.reg = pathToRegExp(this.path, this.keys = [])
}

Layer.prototype.match = function (pathname) {

  let match = pathname.match(this.reg);
  if (match) {
    this.params = this.keys.reduce((memo, current, index) => {
      memo[current.name] = match[index + 1];
      return memo;
    }, {})
    return true;
  }

  if (this.path === pathname) return true;
  if (!this.route) {
    if (this.path === '/') {
      return true;
    }
    return pathname.startsWith(this.path + '/');
  }
}

Layer.prototype.handle_error = function (err, req, res, next) {
  if (this.handler.length === 4) {
    return this.handler(err, req, res, next);
  } else {
    next(err)
  }
}

Layer.prototype.handle_request = function (req, res, next) {
  console.log('111', this);
  this.handler(req, res, next);
}

module.exports = Layer

