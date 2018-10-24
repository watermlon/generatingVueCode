const express = require('express');
const app = new express()
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data
const fs = require('fs')
var exec = require('child_process').exec;
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
app.post('/', function (req, res) {
    console.log(req.body.json)
    fs.readFile('./member.vue', { encoding: 'utf8', flag: 'r+' }, function (err, data) {
        if (err) {
            res.send(500)
        }
        let fileStr = data.toString()
        const strReg = /\/\/@tableTitle@/
        fileStr = fileStr.replace(strReg, req.body.json)
        fs.writeFile(req.body.filePath+req.body.fileName, fileStr, function (err) {
            if(err){
                res.send(err)
            }else{
                console.log('写入成功')
            res.send('写入成功')
            }
            
        })
    })
    // console.log(JSON.stringify(req.body.json))
    // res.redirect('http://127.0.0.1:5500/index.html')
})
function showLetter(callback) {
    exec('wmic logicaldisk get caption', function(err, stdout, stderr) {
        if(err || stderr) {
            console.log("root path open failed" + err + stderr);
            return;
        }
        callback(stdout);
    })
}
app.post('/readFile', function (req, res) {
    const path = req.body.path
    if(path==''){
        showLetter(function(dir){
            let str = dir.replace('Caption','')
            let arr = str.split(':')
            let strArr = []
            arr.forEach(v => {
                strArr.push((v.replace(/\s*/g,""))+':/')
            });
            strArr.pop()
            res.send(strArr)
        })
        return 
    }
    fs.readdir(path, function (err, files) {
        if (err) {
            console.log(err)
            res.send(err)
        } else {
            console.log(files)
            res.send(files)
        }

    })
})
app.listen(3000, function () {
    console.log('run')
})