let express = require('express');
let app = express();
let axios = require('axios');
let fs = require('fs');
let path = require('path');

app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    res.redirect('home');
})

app.get('/home', (req, res) => {
    res.render('home');
})

app.get('/result', (req, res) => {
    let website = req.query.website;
    let fileAddress = req.query.fileAddress;
    let fileName = req.query.fileName;

    //注释里是错误用法，直接用axios.get获得的result.data不是流的格式，而是二进制的。
    // axios.get(website).then((result) => {
    //     console.log(result);
    //     try {
    //         fs.mkdirSync(fileAddress, (err) => {
    //             throw (err);
    //         })
    //         console.log('创建文件夹成功');
    //     } catch {
    //         console.log('文件夹已存在，不需创建')
    //     }
    //     fs.createReadStream(result.data).pipe(fs.WriteStream(fileAddress+fileName)).on('finish', () => {
    //         console.log('下载完成');
    //         res.locals.result = '下载完成';
    //         res.render('result');
    //     });
    // })

    //自定义请求的写法
    // axios({
    //     method: 'get',
    //     url: website,
    //     responseType: 'stream'
    // }).then((res) => {
    //     try {
    //         fs.mkdirSync(fileAddress, (err) => {
    //             throw (err);
    //         })
    //         console.log('创建文件夹成功');
    //     } catch {
    //         console.log('文件夹已存在，不需创建')
    //     }
    //     //因为这里res.data已经是流的格式了，所以直接pipe就可以，不需要fs.createReadStream
    //     res.data.pipe(fs.createWriteStream(fileAddress + fileName));
    // })

    axios.get(website, {
        responseType: 'stream'
    }).then((result) => {
        try {
            fs.mkdirSync(fileAddress, (err) => {
                throw (err);
            })
            console.log('创建文件夹成功');
        } catch {
            console.log('文件夹已存在，不需创建')
        }
        //因为这里res.data已经是流的格式了，所以直接pipe就可以，不需要fs.createReadStream
        result.data.pipe(fs.createWriteStream(fileAddress + fileName));
        res.redirect('home')
    }).catch((err) => {
        throw(err);
    });
})


app.listen(8000, () => {
    console.log('App listening on port 8000!');
});