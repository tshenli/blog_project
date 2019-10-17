var express = require('express');
var router = express.Router();
var articleModel = require('../db/articleModel');
var multiparty = require("multiparty");
var fs = require("fs");

// 创建一个form对象
var form = new multiparty.Form();
// 写文章的路由
router.post('/write', (req, res, next) => {
    let { title, content, username, id } = req.body;
    let createTime = Date.now();
    if (id) {
        // 存在id就进行修改
        id = new Object(id);
        // 进行数据库更新
        articleModel.updateOne({ _id: id }, { createTime, content, title }).then((data) => {
            res.redirect('/');
        }).catch((err) => {
            res.redirect('/write');
        })
    } else {
        // 不存在id就进行新增 
        // 记录写文章的用户名
        let username = req.session.username;
        // 插入数据库
        articleModel.insertMany({ title, content, createTime, username }).then((data) => {
            // 入库成功
            res.redirect("/");
        }).catch((err) => {
            res.redirect("/write");
        })
    }

});

router.post("/upload", (req, res, next) => {
    // 创建一个对象
    form.parse(req, (err, field, files) => {
        if (err) {
            console.log("文件上传失败");
        } else {
            var file = files.filedata[0];
            // 读取流
            var read = fs.createReadStream(file.path);
            // 写入流
            var write = fs.createWriteStream("./public/images/" + file.originalFilename);
            // 管道流：图片写入指定目标
            read.pipe(write);
            write.on("close", () => {
                res.send({ err: 0, msg: "/images/" + file.originalFilename });
            })
        }
    })
})

// 删除文章路由
router.get('/delete', (req, res, next) => {
    // 获取文章id
    let id = req.query.id;
    // 转换id数据类型为Object类型
    id = new Object(id);
    // 操作数据库：删除
    articleModel.deleteOne({ _id: id }).then((data) => {
        res.redirect("/");
    }).catch((err) => {
        res.redirect("/");
    })
});

module.exports = router;
