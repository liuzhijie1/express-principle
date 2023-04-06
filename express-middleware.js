// express 内部提供的一些属性
const express = require('./express')

const app = express();
app.use(function (req, res, next) {
  let url = require('url');
  let path = require('path');
  let fs = require('fs');
  let mime = require('mime');
  let { query, path: p } = url.parse(req.url, true);
  req.query = query;
  req.path = p;
  res.send = function (value) {
    if (Buffer.isBuffer(value) || typeof value === 'string') {
      res.end(value);
    } else if (typeof value === 'object') {
      res.end(JSON.stringify(value))
    }
  }
  res.sendFile = function (filename, options) {
    const { root } = options || {};
    let filePath = '';
    if (typeof root === 'undefined') {
      filePath = filename;
    } else {
      filePath = path.resolve(root, filename);
    }
    res.setHeader('Content-Type', mime.lookup(filePath) + ';charset=utf-8');
    fs.createReadStream(filePath).pipe(res)
  }
  next();
})

express.static = function (dirname) {
  return (req, res, next) => {
    let path = require('path');
    let fs = require('fs');
    let absPath = path.join(dirname, req.path);
    fs.stat(absPath, function (err, statObj) {
      if (err) {
        return next();
      }
      if (statObj.isFile()) {
        return res.sendFile(absPath);
      }
      next();
    })
  }
}

app.use(express.static(__dirname));




app.get('/', function (req, res, next) {
  console.log(req.path)
  console.log(req.query)

  // res.send({name: 'lj'})
  res.sendFile('test.js', { root: __dirname })
})

app.listen(3000)


/**
 * koa koa-router  express 内置 
 * koa-views        express内置了
 * koa-bodyparser   body-parser
 * koa2-multer      muliter
 * koa-static       express内置了
 * 内置cookie       cookie-parser
 * koa-session      express-session
 */