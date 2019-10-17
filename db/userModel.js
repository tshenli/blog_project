//引入mongoose
var mongoose = require("mongoose");
// 创建一个Schema
var userSchema = mongoose.Schema({
    username:String,
    password:Number,
    createTime:Number
}) 
// 创建一个userModel    user:表示集合名
var userModel = mongoose.model("users",userSchema);
// 导出userModel
module.exports = userModel;
 