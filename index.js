var express = require('express');
var cors = require('cors')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const multer = require('multer')
var fs = require('fs');
// const upload = multer({ dest: './public/temp/uploads/' })
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const fleek = require('@fleekhq/fleek-storage-js');
require('dotenv').config()
// const apiKey = process.env.FLEEK_API_KEY;
// const apiSecret = process.env.FLEEK_API_SECRET;


var app = express();
// app.use(function(req, res, next) {

var path = require('path');
global.appRoot = path.resolve(__dirname);
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });
app.use(cors())


app.get('/', function (req, res) {
    // res.send('hello, this is just a backend. The link for the frontend will be added here soon')
    res.sendFile(appRoot+ "/frontend/index.html")
})





const uploadFunction = async (data) => {
    const date = new Date();
    const timestamp = date.getTime();

    const input = {
        apiKey,
        apiSecret,
        key: `${timestamp}.txt`,
        data,
    };

    try {
        const result = await fleek.upload(input);
        console.log(result);
    } catch (e) {
        console.log('error', e);
    }
}

const uploadPicFunction = async (data, ContentType, key) => {

    const input = {
        apiKey,
        apiSecret,
        key,
        data,
        ContentType
    };

    try {
        const result = await fleek.upload(input);
        console.log(result);
    } catch (e) {
        console.log('error', e);
    }
}

async function deleteAllData() {
    try {
        const result = await fleek.deleteFile({
            apiKey,
            apiSecret,
            key: 'alldata.json',
            bucket: '1e4f9433-e9a2-4412-a561-9a1ddf54e93c-bucket',
        });
    } catch (e) {
        console.log('error', e);
    }

}
async function alldataUpload(data) {
    const input = {
        apiKey,
        apiSecret,
        key: 'alldata.json',
        data,
    };

    try {
        const result = await fleek.upload(input);
    } catch (e) {
        console.log('error', e);
    }
}

app.post('/createComplaint', upload.single('upfile'), (req, res) => {
    const fileName = req.file.originalname;
    const fileType = req.file.mimetype;
    const fileSize = req.file.size;
    const theFile = req.file.buffer;
    var userName = req.body.name;
    var userEmail = req.body.email;
    var location = req.body.location;
    var description = req.body.description;
    const date = new Date();
    const PicKey = date.getTime() + '.png';
    var theElement = {
        userName,
        userEmail,
        location,
        description,
        PicKey,
        status: 0
    }
    async function getDB() {


        const res = await fetch('https://storageapi.fleek.co/1e4f9433-e9a2-4412-a561-9a1ddf54e93c-bucket/alldata.json')

        alldata = await res.json();
        // alldata.push(theElement);
        alldata['issues'].push(theElement)


        // delte old file and create new
        await deleteAllData()
        // upload alldata
        await alldataUpload(JSON.stringify(alldata));

        await uploadPicFunction(theFile, fileType, PicKey);

    }
    getDB();

    res.redirect('https://black-hill-6592.on.fleek.co/success.html');


    // uploadFunction(userName);
    // uploadFunction(userEmail);
    // uploadFunction(location);
    // uploadFunction(description);





})


app.post('/updateStatus', function (req, res) {
    const id = req.body.idbtn;
    const status = req.body.submitButton;


    // alldata = JSON.parse(alldata)
    async function getDB() {
        const res = await fetch('https://storageapi.fleek.co/1e4f9433-e9a2-4412-a561-9a1ddf54e93c-bucket/alldata.json')

        alldata = await res.json();

        if (status == 'Close') {
            alldata['issues'][id].status = 2;
        } else if (status == 'Investigating') {
            alldata['issues'][id].status = 1;
        }

        await deleteAllData()
        await alldataUpload(JSON.stringify(alldata));

    }

    getDB()
    res.redirect('https://black-hill-6592.on.fleek.co/success.html');

})




















































const port = process.env.PORT || 3000;
app.listen(port, function () {

    console.log('Your app is listening on port ' + port + '\n' + 'http://localhost:' + port)
});