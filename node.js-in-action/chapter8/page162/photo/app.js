const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');

// 加载路由模块
var index = require('./routes/index');
var users = require('./routes/users');
var photos = require('./routes/photos'); // add 照片列表视图
var upload = require('./routes/upload')
var download = require('./routes/download')

var app = express();

// view engine setup
nunjucks.configure('views', {
  autoescape: true,
  express: app
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'njk');

// 测试res.locals和res.locals
// app.set('title', 'My Application');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); //窗体数据被编码为名称/值对
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 路由
app.use('/', photos); // 首页直接显示照片列表
app.use('/users', users);
app.use('/upload', upload);
app.use('/photo', download)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
