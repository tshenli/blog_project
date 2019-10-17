//引入mongoose
var mongoose = require("mongoose");
// 创建一个Schema
var articleSchema = mongoose.Schema({
    title:String,
    content:String,
    createTime:Number,
    username:String
}) 
// 创建一个userModel    user:表示集合名
var articleModel = mongoose.model("articles",articleSchema);
// 导出userModel
module.exports = articleModel;