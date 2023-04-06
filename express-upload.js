const express = require('express')
const multer = require('multer')
const upload = multer({dest: 'uploads/'})
const app = express();

app.use(express.static(__dirname))

app.post('/upload', upload.single('avatar'), function (req, res, next) {
  res.send(req.file);
})


app.listen(3000)