// 引入mongoose模块
var mongoose = require("mongoose");

// 连接数据库:   协议名://Ip地址:端口号（mongoose默认端口27017，可不写）/数据库名
mongoose.connect("mongodb://localhost/project",{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

// 获取连接对象
var db = mongoose.connection;

// 添加事件
db.on("error",(err)=>{
    console.log("数据库连接失败，请检查！");
})
db.once("open",()=>{
    console.log("数据库连接成功！！")
})
