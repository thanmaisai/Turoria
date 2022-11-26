var express = require('express');
var cors = require('cors')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const multer = require('multer')
var fs = require('fs');
// const upload = multer({ dest: './public/temp/uploads/' })
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

require('dotenv').config()


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
    res.sendFile(appRoot + "/frontend/index.html")
})

app.get('/index', function (req, res) {
    // res.send('hello, this is just a backend. The link for the frontend will be added here soon')
    res.sendFile(appRoot + "/frontend/index.html")
})

app.get('/student', function (req, res) {
    // res.send('hello, this is just a backend. The link for the frontend will be added here soon')
    res.sendFile(appRoot + "/frontend/student.html")
})

app.get('/mentor', function (req, res) {
    // res.send('hello, this is just a backend. The link for the frontend will be added here soon')
    res.sendFile(appRoot + "/frontend/mentor.html")
})


app.get('/Mentorslist', function (req, res) {
    // res.send('hello, this is just a backend. The link for the frontend will be added here soon')
    res.sendFile(appRoot + "/frontend/Mentorslist.html")
})

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



    res.redirect('/success');


    // uploadFunction(userName);
    // uploadFunction(userEmail);
    // uploadFunction(location);
    // uploadFunction(description);





})


app.post('/updateStatus', function (req, res) {
    const id = req.body.idbtn;
    const status = req.body.submitButton;


    // alldata = JSON.parse(alldata)


    res.redirect('/success');

})

const port = process.env.PORT || 3000;
app.listen(port, function () {

    console.log('Your app is listening on port ' + port + '\n' + 'http://localhost:' + port)
});