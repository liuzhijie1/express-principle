
const Application = require('./application')

const Router = require('./router/index')

// 1、实现当前的应用，和创建应用的分离

function createApplication() {
  return new Application();
}

createApplication.Router = Router;


module.exports = createApplication;