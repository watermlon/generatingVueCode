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
    fs.readFile('./template.vtpl', { encoding: 'utf8', flag: 'r+' }, function (err, data) {
        if (err) {
            res.send(500)
        }
        //==生成搜索条件
        const searchList = req.body.searchList
        let searchDataDomStr = ''
        let searchDataStr = '{'
        searchList.forEach(v=>{
            searchDataDomStr+=
            `<FormItem>
                <Input type="text" v-model="searchData.${v.key}" placeholder="${v.text}">
                    <span slot="prepend">${v.text}</span>
                </Input>
            </FormItem>`
            
            searchDataStr += `${v.key}:'',`
        })
        searchDataStr+='}'
        //====获取模板数据
        let fileStr = data.toString()
        //==需要替换的正则
        const strReg = /\/\/@tableTitle@/
        const postUrlReg = /\/\/@postUrl@/
        const searchBoxReg = /<!-- @searchDom@ -->/
        const searchDataReg = /\/\/@serchData@/
        let jsonData = req.body.json
        //生成表头
        let str = '['
        req.body.json.forEach((v,k) => {
            str+=`{title:"${v.title}",key:"${v.key}"`
            if (v.render) {
                str+= `,render:(h, params) => {
                    return h("Button", {
                        props: {
                            type: "error",
                            size: "small"
                        },
                        on: {
                            click: () => {
                                this.$Modal.confirm({
                                    title: "确认删除这条数据吗？",
                                    loading: true,
                                    onOk: () => {
                                        //TODO 在这里处理删除的逻辑
                                        setTimeout(() => {
                                            //关闭对话框
                                            this.$Modal.remove();
                                        }, 1000)
                                    }
                                });
                            }
                        }
                    },
                        "删除"
                    )
                }`
            }
            if(k==req.body.json.length-1){
                str+=`}`
            }else{
                str+=`},`
            }
            
        })
        str+=']'
        fileStr = fileStr.replace(strReg, str)
        fileStr = fileStr.replace(postUrlReg, `"${req.body.postUrl}"`)
        fileStr = fileStr.replace(searchBoxReg,searchDataDomStr)
        fileStr = fileStr.replace(searchDataReg,searchDataStr)
        fs.writeFile(req.body.filePath + '/' + req.body.fileName, fileStr, function (err) {
            if (err) {
                res.send(err)
            } else {
                console.log(req.body.filePath + '/' + req.body.fileName + '写入成功')
                res.send(req.body.filePath + '/' + req.body.fileName + '写入成功')
            }

        })
    })
})
function showLetter(callback) {
    exec('wmic logicaldisk get caption', function (err, stdout, stderr) {
        if (err || stderr) {
            console.log("root path open failed" + err + stderr);
            return;
        }
        callback(stdout);
    })
}
app.post('/readFile', function (req, res) {
    const path = req.body.path
    if (path == '') {
        showLetter(function (dir) {
            let str = dir.replace('Caption', '')
            let arr = str.split(':')
            let strArr = []
            arr.forEach(v => {
                strArr.push((v.replace(/\s*/g, "")) + ':/')
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