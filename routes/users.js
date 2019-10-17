var express = require('express');
var router = express.Router();
var userModel = require("../db/userModel");

/* GET users listing. */
router.get('/getUserList', function (req, res, next) {
  // 进行数据库的操作
  userModel.find().then((docs) => {
    console.log("数据查询成功", docs);
    res.send({ err: 0, msg: "success", data: docs });
  }).catch((err) => {
    console.log("数据查询失败", err);
    res.send({ err: -1, msg: "fail" });
  })
});


// 定义注册接口
router.post('/regist', (req, res, next) => {
  // 接收post数据
  let { username, password, password2 } = req.body;

  // 数据校验



  // 查询是否存在这个用户
  userModel.find({ username }).then((docs) => {
    if (docs.length > 0) {
      res.send("用户名已存在，请重新注册")
    } else {
      // 获取时间戳
      let createTime = Date.now();
      // 操作数据库
      userModel.insertMany({ username, password, createTime }).then((data) => {
        res.redirect("/login");
      }).catch((err) => {
        res.redirect("/regist");
      })
    }
  })

});


// 定义登录接口
router.post('/login', (req, res, next) => {
  // 接收post数据
  let { username, password } = req.body;
  let createTime = Date.now();
  // 操作数据库
  userModel.find({ username, password }).then((docs) => {
    if (docs.length > 0) {
      // 登录成功后，在服务端使用session记录用户信息
      req.session.username = username;
      req.session.isLogin = true;
      res.redirect("/");
    } else {
      res.redirect("/login");
    }
  }).catch((err) => {
    res.redirect("/login");
  })
});
module.exports = router;
