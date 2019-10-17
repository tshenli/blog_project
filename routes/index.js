var express = require('express');
var router = express.Router();
var articleModel = require("../db/articleModel");
var moment = require('moment');

// 首页路由
router.get('/', function (req, res, next) {
  let page = parseInt(req.query.page || 1);
  let size = parseInt(req.query.size || 2);
  let username = req.session.username;

  // 第一步：查询文章总条数
  articleModel.find().count().then((total) => {
    var pages = Math.ceil(total / size);
    // 第二步：分页查询
    articleModel.find().sort({ createTime: -1 }).limit(size).skip((page - 1) * size).then((docs) => {
      //对数据中的时间字段进行处理
      var arr = docs.slice();
      for (let i = 0; i < arr.length; i++) {
        arr[i].createTimeD = moment(arr[i].createTime).format("YYYY-MM-DD HH:mm:ss");
      }
      res.render('index', { data: { list: arr, total: pages,username:username } });
    }).catch((err) => {
      res.redirect("/");
    })
  }).catch((err) => {
    res.redirect("/");
  })

});
// 注册路由
router.get('/regist', function (req, res, next) {
  res.render('regist', {});
});

// 登录路由
router.get('/login', function (req, res, next) {
  res.render('login', {});
});

// 写文章路由
router.get('/write', function (req, res, next) {
  var id = req.query.id;
  if (id) {
    // 编辑
    id = new Object(id);//将id转换Object类型的数据
    // 用id查询
    articleModel.findById({ _id: id }).then((doc) => {
      res.render('write', { doc: doc });
    }).catch((err) => {
      res.render("/");
    })

  } else {
    // 新增
    var doc = {  //构造一个对象，用于编辑文章
      _id: "",
      username: req.session.username,
      title: "",
      content: ""
    }
    res.render('write', { doc });
  }
});

// 文章详情路由
router.get('/detail', function (req, res, next) {
  // 获取时间戳
  // var time = parseInt(req.query.id);
  // 获取id
  var id = new Object(req.query.id);

  // 用id查询
  articleModel.findById({ _id: id }).then((doc) => {
    // 处理时间戳
    doc.createTimeD = moment(doc.createTime).format("YYYY-MM-DD HH:mm:ss");
    res.render('detail', { doc: doc });
  }).catch((err) => {
    res.send(err);
  })

  //用时间戳查询
  // articleModel.find({ createTime: time}).then((doc) => {
  //   res.send({ data: doc });
  // }).catch((err) => {
  //   res.send(err);
  // })
});

module.exports = router;
