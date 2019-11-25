//import
const express = require('express');
const exphb = require('express-handlebars');
const path = require('path');
const fs = require('fs'); //filesystem

//init
const app = express();
const APP_PORT = process.env.PORT || 5000;

//setup handlebar
app.engine('hbs', exphb());
app.set('view engine', 'hbs');

//initialize static content: serve files from 'public'
app.use(express.static(path.join(__dirname, 'public')));
imageDir = path.join(__dirname, 'views', 'images');
app.use(express.static(imageDir));

//Read filenames b4 endpoint is accessed, n cache to defined arrays
const randomImagesArr = [];
const randomImagesArrWithPath = [];

fs.readdir(imageDir, function(err,filenames) {  
    if (err) {
        return;
    }
    filenames.forEach(function(filename) { //executes a provided function once for each array element
        randomImagesArr.push(filename);
        randomImagesArrWithPath.push(path.join(imageDir, filename))
    });
});

//Helper random function
function getRandomInt(max) {
    return Math.floor(Math.random()* Math.floor(max)); //make it integer
}

//Endpoint tt returns HTML structure. localhost:3000 returns index.html
app.get('/image',(req,res,next)=>{
    res.status(200);
    res.type('text/html');
    let randomNumber = getRandomInt(randomImagesArr.length);
    res.send(`<img src="${randomImagesArr[randomNumber]}"></img>`);
});

//Qns3
app.get('/image/:imageId',(req,res,next)=>{  //localhost:5000/image/kitty1
    res.status(200);
    res.type('text/html');
    res.send(req.params);  //{"imageId":"kitty1"}
    // res.send(`<img src="${path.join(imageDir, req.params.imageId)}.jpg"></img>`);???
});

//Endpoint tt uses hbs (nt r'qd)
app.get('/image2', (req,res,nest)=> {
    let randomNumber =  getRandomInt(randomImagesArr.length);
    res.render('randomImage', {randomImageURL: randomImagesArr[randomNumber]});
})

//Endpoint tt returns file (optional workshop)
app.get('/random-image', (req,res,next)=> {
    let randomNumber = getRandomInt(randomImagesArrWithPath.length);
    res.sendFile(randomImagesArrWithPath[randomNumber]);
})

//if requested file is nt found, use following function to handle it
app.use((req, res, next)=>{
    res.send("<b>ERROR!</b>");
});

app.listen(APP_PORT, ()=>{
    console.log(`App Server started on ${APP_PORT}`)
})

//test