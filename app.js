var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// 连接数据库
var db = require("./db/connect");
// 导入session模块
var session = require("express-session");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// 引入编辑路由模块
var articleRouter = require('./routes/articles');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
// 基于body-parser把客户端post请求中的body数据进行数据解析，得到JSON格式的数据  （中间件）
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// 静态资源目录
app.use(express.static(path.join(__dirname, 'public')));
// 配置session文件
app.use(session({
  secret: 'qf project',   // 任意字符串
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 }   // 指定登录会话的有效时长，单位毫秒 （5分钟）
}))

// 用户登录拦截操作
app.get('*', function (req, res, next) {
  let { username } = req.session;
  let url = req.url;    //获取路径
  if (url != '/login' && url != '/regist') {
    if (!username) {
      // 用户未登录，跳转登录页面
      res.redirect('/login')
    }
  }
  next()
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/articles', articleRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
