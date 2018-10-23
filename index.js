const express = require('express');
const app = new express()
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data
const fs = require('fs')
//跨域设置
app.all('*', function (req, res, next) {
    console.log(req.headers.origin)
    res.header("Access-Control-Allow-Credentials", true)
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", '4.16.2')
    if (req.method == "OPTIONS") {
        res.send(200);
    }/*让options请求快速返回*/
    else next();
});
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.post('/',function(req,res){
    console.log(req.body.json)
    fs.readFile('./member.vue',{encoding:'utf-8',flag:'r+'},function(err,data){
        if(err) {
            res.send(500)
        }
        console.log(data.toString())
    })
    // console.log(JSON.stringify(req.body.json))
    // res.redirect('http://127.0.0.1:5500/index.html')
})
app.listen(3000,function(){
    console.log('run')
})