var fs = require('fs');
var exphbs  = require('express-handlebars');
var express = require("express");
var hbs = require("express-handlebars");
var indexRouter = require('./routes/router');
var path = require('path');

console.log("Seting up Port")
var port = 3598;
console.log(`Server will listen on port ${port}`)
app = express();

console.log("Initializing Express...")
console.log("Initializing Handlebars")
app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');
console.log("Initializing router...")
app.use('/', indexRouter);
app.get('/', (req, res, next) =>{
    res.send('home')
});
module.exports = app;
console.log("Initializing Other stuff related to express...")
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

console.log("Starting WebServer...")
console.log("Todays plans...")
console.log("Take Over the world!")
console.log("Watch Anglebeats for the 1024th time.")
//God damn it... i'm trash u_u
app.listen(port, (err)=>{
    if (err){
        return console.log('An error sucessfully happend', err)
    }else{
        console.log(`Starting Web Server for ping monitoring on port ${port}`);
    }
})